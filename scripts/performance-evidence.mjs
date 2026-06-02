import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_URL = "https://www.roth-conversion-calculator-ai.shop";
const targetUrl = (process.env.PERFORMANCE_EVIDENCE_URL || DEFAULT_URL).replace(/\/+$/, "");
const minPerformanceScore = Number(process.env.PERFORMANCE_EVIDENCE_MIN_SCORE || "0.5");
const minSeoScore = Number(process.env.PERFORMANCE_EVIDENCE_MIN_SEO_SCORE || "0.95");
const maxLargestContentfulPaintMs = Number(process.env.PERFORMANCE_EVIDENCE_MAX_LCP_MS || "5000");
const maxTotalBlockingTimeMs = Number(process.env.PERFORMANCE_EVIDENCE_MAX_TBT_MS || "600");
const maxCumulativeLayoutShift = Number(process.env.PERFORMANCE_EVIDENCE_MAX_CLS || "0.1");
const requestedSampleCount = Number(process.env.PERFORMANCE_EVIDENCE_SAMPLE_COUNT || "3");
const sampleCount = Math.min(Math.max(Math.trunc(requestedSampleCount) || 1, 1), 5);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(/^https:\/\/[^\s]+$/.test(targetUrl), "PERFORMANCE_EVIDENCE_URL must be an HTTPS URL without whitespace");

function runLighthouse(outputPath) {
  return new Promise((resolve, reject) => {
    const lighthouseArgs = [
      "--yes",
      "lighthouse",
      targetUrl,
      "--only-categories=performance,seo",
      "--output=json",
      `--output-path=${outputPath}`,
      "--chrome-flags=--headless --no-sandbox",
      "--quiet",
    ];
    const command = process.platform === "win32" ? "cmd.exe" : "npx";
    const windowsCommand = `npx --yes lighthouse ${targetUrl} --only-categories=performance,seo --output=json --output-path="${outputPath}" "--chrome-flags=--headless --no-sandbox" --quiet`;
    const args = process.platform === "win32" ? ["/d", "/s", "/c", windowsCommand] : lighthouseArgs;
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        if (fs.existsSync(outputPath)) {
          resolve(stderr.trim());
          return;
        }

        reject(new Error(`Lighthouse exited with ${code}: ${stderr.trim()}`));
        return;
      }

      resolve("");
    });
  });
}

function metric(audits, key) {
  return audits[key]?.numericValue ?? null;
}

function auditItems(audits, key) {
  return audits[key]?.details?.items ?? [];
}

function roundMetric(value) {
  return typeof value === "number" ? Math.round(value * 100) / 100 : value;
}

function topItems(items, sortKey, mapItem, limit = 5) {
  return items
    .filter((item) => typeof item?.[sortKey] === "number" && item[sortKey] > 0)
    .sort((a, b) => b[sortKey] - a[sortKey])
    .slice(0, limit)
    .map(mapItem);
}

function classifyUrl(url) {
  if (!url) {
    return "unknown";
  }

  if (url === "Unattributable") {
    return "unattributable";
  }

  if (url === targetUrl || url === `${targetUrl}/`) {
    return "homepageDocument";
  }

  if (url.includes("/_next/static/chunks/")) {
    return "nextChunk";
  }

  if (url.startsWith(targetUrl)) {
    return "firstPartyOther";
  }

  return "thirdParty";
}

function addAttribution(groups, groupName, durationMs) {
  if (typeof durationMs !== "number" || durationMs <= 0) {
    return;
  }

  const current = groups.get(groupName) ?? { count: 0, durationMs: 0 };
  groups.set(groupName, {
    count: current.count + 1,
    durationMs: current.durationMs + durationMs,
  });
}

function summarizeAttribution(longTasks, scriptBootup) {
  const groups = new Map();

  for (const task of longTasks) {
    addAttribution(groups, classifyUrl(task.url), task.durationMs);
  }

  for (const script of scriptBootup) {
    addAttribution(groups, classifyUrl(script.url), script.totalMs);
  }

  return Array.from(groups.entries())
    .map(([group, summary]) => ({
      count: summary.count,
      durationMs: roundMetric(summary.durationMs),
      group,
    }))
    .sort((a, b) => b.durationMs - a.durationMs);
}

function summarizeTbtDiagnostics(audits) {
  const longTasks = topItems(auditItems(audits, "long-tasks"), "duration", (item) => ({
      durationMs: roundMetric(item.duration),
      startTimeMs: roundMetric(item.startTime),
      url: item.url || "",
    }));
  const scriptBootup = topItems(auditItems(audits, "bootup-time"), "total", (item) => ({
      parseCompileMs: roundMetric(item.scriptParseCompile),
      scriptingMs: roundMetric(item.scripting),
      totalMs: roundMetric(item.total),
      url: item.url || "",
    }));

  return {
    attributionSummary: summarizeAttribution(longTasks, scriptBootup),
    longTasks,
    mainThreadWork: topItems(auditItems(audits, "mainthread-work-breakdown"), "duration", (item) => ({
      durationMs: roundMetric(item.duration),
      group: item.group || "",
      groupLabel: item.groupLabel || "",
    })),
    scriptBootup,
    thirdPartyMainThread: topItems(auditItems(audits, "third-party-summary"), "mainThreadTime", (item) => ({
      blockingTimeMs: roundMetric(item.blockingTime),
      entity: item.entity || "",
      mainThreadTimeMs: roundMetric(item.mainThreadTime),
      transferSizeBytes: item.transferSize ?? 0,
    })),
  };
}

function summarize(report) {
  const performanceScore = report.categories?.performance?.score ?? null;
  const seoScore = report.categories?.seo?.score ?? null;
  const metrics = {
    cumulativeLayoutShift: metric(report.audits, "cumulative-layout-shift"),
    firstContentfulPaintMs: metric(report.audits, "first-contentful-paint"),
    largestContentfulPaintMs: metric(report.audits, "largest-contentful-paint"),
    speedIndexMs: metric(report.audits, "speed-index"),
    totalBlockingTimeMs: metric(report.audits, "total-blocking-time"),
  };

  assert(seoScore >= minSeoScore, `Mobile Lighthouse SEO score ${seoScore} is below ${minSeoScore}`);

  const thresholdResults = [
    {
      actual: performanceScore,
      metric: "performanceScore",
      passed: performanceScore >= minPerformanceScore,
      threshold: minPerformanceScore,
    },
    {
      actual: seoScore,
      metric: "seoScore",
      passed: seoScore >= minSeoScore,
      threshold: minSeoScore,
    },
    {
      actual: metrics.largestContentfulPaintMs,
      metric: "largestContentfulPaintMs",
      passed: metrics.largestContentfulPaintMs <= maxLargestContentfulPaintMs,
      threshold: maxLargestContentfulPaintMs,
    },
    {
      actual: metrics.totalBlockingTimeMs,
      metric: "totalBlockingTimeMs",
      passed: metrics.totalBlockingTimeMs <= maxTotalBlockingTimeMs,
      threshold: maxTotalBlockingTimeMs,
    },
    {
      actual: metrics.cumulativeLayoutShift,
      metric: "cumulativeLayoutShift",
      passed: metrics.cumulativeLayoutShift <= maxCumulativeLayoutShift,
      threshold: maxCumulativeLayoutShift,
    },
  ];
  const manualReviewRequired = thresholdResults.some((result) => !result.passed);
  const reviewTriggers = thresholdResults
    .filter((result) => !result.passed)
    .map((result) => ({
      actual: result.actual,
      metric: result.metric,
      threshold: result.threshold,
    }));
  const reviewSummary = manualReviewRequired
    ? `Manual review required for ${reviewTriggers.map((trigger) => trigger.metric).join(", ")}. Treat isolated GitHub runner TBT variance as lab evidence before changing production UX.`
    : "No manual performance review required.";

  return {
    categories: {
      performance: performanceScore,
      seo: seoScore,
    },
    environment: {
      benchmarkIndex: report.environment?.benchmarkIndex ?? null,
      hostUserAgent: report.environment?.hostUserAgent ?? "",
      networkUserAgent: report.environment?.networkUserAgent ?? "",
    },
    fetchedAt: report.fetchTime,
    lighthouseVersion: report.lighthouseVersion,
    metrics,
    manualReviewRequired,
    reviewSummary,
    reviewTriggers,
    tbtDiagnostics: summarizeTbtDiagnostics(report.audits),
    requestedUrl: report.requestedUrl,
    finalUrl: report.finalDisplayedUrl || report.finalUrl,
    thresholds: {
      maxCumulativeLayoutShift,
      maxLargestContentfulPaintMs,
      maxTotalBlockingTimeMs,
      minPerformanceScore,
      minSeoScore,
    },
    thresholdResults,
  };
}

function attemptSummary(attempt, summary, lighthouseWarning) {
  return {
    attempt,
    lighthouseWarning: lighthouseWarning || null,
    ok: true,
    performanceScore: summary.categories.performance,
    seoScore: summary.categories.seo,
    largestContentfulPaintMs: roundMetric(summary.metrics.largestContentfulPaintMs),
    totalBlockingTimeMs: roundMetric(summary.metrics.totalBlockingTimeMs),
    cumulativeLayoutShift: roundMetric(summary.metrics.cumulativeLayoutShift),
    manualReviewRequired: summary.manualReviewRequired,
  };
}

function failedAttemptSummary(attempt, error, lighthouseWarning = null) {
  return {
    attempt,
    error: error instanceof Error ? error.message : String(error),
    lighthouseWarning: lighthouseWarning || null,
    ok: false,
  };
}

function selectedMedianSample(validSamples) {
  return [...validSamples]
    .sort((a, b) => a.summary.metrics.totalBlockingTimeMs - b.summary.metrics.totalBlockingTimeMs)
    [Math.floor((validSamples.length - 1) / 2)];
}

async function collectSample(attempt) {
  const outputPath = path.join(os.tmpdir(), `rothcalc-lighthouse-${Date.now()}.json`);
  let lighthouseWarning = null;

  try {
    lighthouseWarning = await runLighthouse(outputPath);
    const report = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    const summary = summarize(report);

    return {
      attempt,
      lighthouseWarning,
      summary,
      attemptSummary: attemptSummary(attempt, summary, lighthouseWarning),
    };
  } catch (error) {
    return {
      attempt,
      attemptSummary: failedAttemptSummary(attempt, error, lighthouseWarning),
    };
  } finally {
    fs.rmSync(outputPath, { force: true });
  }
}

async function run() {
  const samples = [];

  for (let attempt = 1; attempt <= sampleCount; attempt += 1) {
    samples.push(await collectSample(attempt));
  }

  const validSamples = samples.filter((sample) => sample.summary);
  assert(validSamples.length > 0, "No valid Lighthouse samples produced a passing SEO category");

  const selectedSample = selectedMedianSample(validSamples);
  const summary = selectedSample.summary;
  const attempts = samples.map((sample) => sample.attemptSummary);

  console.log(
    JSON.stringify(
      {
        baseUrl: targetUrl,
        evidenceSource: "lighthouse-mobile-lab",
        lighthouseWarning: selectedSample.lighthouseWarning || null,
        ok: true,
        samplePolicy: {
          attempts,
          requestedSamples: sampleCount,
          selectedAttempt: selectedSample.attempt,
          selectionStrategy: "median-total-blocking-time-valid-seo-sample",
          validSamples: validSamples.length,
        },
        ...summary,
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(
    JSON.stringify(
      {
        baseUrl: targetUrl,
        error: error instanceof Error ? error.message : String(error),
        evidenceSource: "lighthouse-mobile-lab",
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
