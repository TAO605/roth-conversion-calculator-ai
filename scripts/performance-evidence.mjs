import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_URL = "https://www.roth-conversion-calculator-ai.shop";
const targetUrl = (process.env.PERFORMANCE_EVIDENCE_URL || DEFAULT_URL).replace(/\/+$/, "");
const minPerformanceScore = Number(process.env.PERFORMANCE_EVIDENCE_MIN_SCORE || "0.6");
const minSeoScore = Number(process.env.PERFORMANCE_EVIDENCE_MIN_SEO_SCORE || "0.95");
const maxLargestContentfulPaintMs = Number(process.env.PERFORMANCE_EVIDENCE_MAX_LCP_MS || "5000");
const maxTotalBlockingTimeMs = Number(process.env.PERFORMANCE_EVIDENCE_MAX_TBT_MS || "600");
const maxCumulativeLayoutShift = Number(process.env.PERFORMANCE_EVIDENCE_MAX_CLS || "0.1");

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

function summarize(report) {
  const performanceScore = report.categories.performance.score;
  const seoScore = report.categories.seo.score;
  const metrics = {
    cumulativeLayoutShift: metric(report.audits, "cumulative-layout-shift"),
    firstContentfulPaintMs: metric(report.audits, "first-contentful-paint"),
    largestContentfulPaintMs: metric(report.audits, "largest-contentful-paint"),
    speedIndexMs: metric(report.audits, "speed-index"),
    totalBlockingTimeMs: metric(report.audits, "total-blocking-time"),
  };

  assert(performanceScore >= minPerformanceScore, `Mobile Lighthouse performance score ${performanceScore} is below ${minPerformanceScore}`);
  assert(seoScore >= minSeoScore, `Mobile Lighthouse SEO score ${seoScore} is below ${minSeoScore}`);
  assert(metrics.largestContentfulPaintMs <= maxLargestContentfulPaintMs, `Mobile LCP ${metrics.largestContentfulPaintMs}ms exceeds ${maxLargestContentfulPaintMs}ms`);
  assert(metrics.totalBlockingTimeMs <= maxTotalBlockingTimeMs, `Mobile TBT ${metrics.totalBlockingTimeMs}ms exceeds ${maxTotalBlockingTimeMs}ms`);
  assert(metrics.cumulativeLayoutShift <= maxCumulativeLayoutShift, `Mobile CLS ${metrics.cumulativeLayoutShift} exceeds ${maxCumulativeLayoutShift}`);

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
    requestedUrl: report.requestedUrl,
    finalUrl: report.finalDisplayedUrl || report.finalUrl,
    thresholds: {
      maxCumulativeLayoutShift,
      maxLargestContentfulPaintMs,
      maxTotalBlockingTimeMs,
      minPerformanceScore,
      minSeoScore,
    },
  };
}

async function run() {
  const outputPath = path.join(os.tmpdir(), `rothcalc-lighthouse-${Date.now()}.json`);
  const lighthouseWarning = await runLighthouse(outputPath);
  const report = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  fs.rmSync(outputPath, { force: true });
  const summary = summarize(report);

  console.log(
    JSON.stringify(
      {
        baseUrl: targetUrl,
        evidenceSource: "lighthouse-mobile-lab",
        lighthouseWarning: lighthouseWarning || null,
        ok: true,
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
