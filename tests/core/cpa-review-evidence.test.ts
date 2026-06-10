import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { validateCpaReviewEvidence } from "../../scripts/validate-cpa-review-evidence.mjs";

function readTemplate() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "docs/cpa-review-evidence-template.json"), "utf8"));
}

describe("CPA review evidence", () => {
  it("ships a validator command and template for qualified professional review evidence", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const template = readTemplate();

    expect(packageJson.scripts["ops:cpa-review-evidence-validate"]).toBe(
      "node scripts/validate-cpa-review-evidence.mjs",
    );
    expect(template.evidenceType).toBe("cpa-review-evidence");
    expect(template.recordStatus).toBe("template");
    expect(template.privacyBoundary.join(" ")).toContain("AI model cross-checks");
  });

  it("keeps the template valid without pretending review is complete", () => {
    const result = validateCpaReviewEvidence(readTemplate());

    expect(result).toMatchObject({
      evidenceType: "cpa-review-evidence-validation",
      ok: true,
      recordStatus: "template",
    });
    expect(result.reviewBoundary).toContain("only accepts a recorded human CPA, EA, or tax attorney review");
  });

  it("accepts a recorded redacted CPA review record", () => {
    const record = {
      ...readTemplate(),
      recordStatus: "recorded",
      reviewer: {
        credential: "CPA",
        firmOrLicenseReference: "public state board lookup retained separately",
        jurisdiction: "California",
        name: "Qualified reviewer",
      },
      review: {
        decision: "approved",
        notes: "Reviewed scope and no required changes in this redacted evidence record.",
        requiredChanges: [],
        reviewedAt: "2026-06-10",
        scope: readTemplate().review.scope,
        taxYear: 2026,
      },
      evidence: {
        capturedAt: "2026-06-10T10:40:00.000Z",
        capturedBy: "site owner",
        reviewLetterPath: "docs/evidence/cpa-review-2026-06-10-redacted.pdf",
      },
    };

    expect(validateCpaReviewEvidence(record)).toMatchObject({
      credential: "CPA",
      decision: "approved",
      ok: true,
      recordStatus: "recorded",
    });
  });

  it("rejects AI model names as a recorded CPA review", () => {
    const record = {
      ...readTemplate(),
      recordStatus: "recorded",
      reviewer: {
        credential: "CPA",
        firmOrLicenseReference: "not applicable",
        jurisdiction: "AI",
        name: "ChatGPT and Claude",
      },
      review: {
        ...readTemplate().review,
        decision: "approved",
        reviewedAt: "2026-06-10",
      },
      evidence: {
        capturedAt: "2026-06-10T10:40:00.000Z",
        capturedBy: "site owner",
        reviewLetterPath: "docs/evidence/ai-cross-check.json",
      },
    };

    const result = validateCpaReviewEvidence(record);

    expect(result.ok).toBe(false);
    expect(result.failures.map((failure) => failure.field)).toContain("reviewer.name");
  });

  it("blocks secrets and private taxpayer identifiers from review evidence", () => {
    const record = {
      ...readTemplate(),
      recordStatus: "recorded",
      evidence: {
        ...readTemplate().evidence,
        reviewLetterPath: "docs/evidence/review-with-123-45-6789.pdf",
      },
    };

    const result = validateCpaReviewEvidence(record);

    expect(result.ok).toBe(false);
    expect(result.failures.map((failure) => failure.field)).toContain("privacyBoundary");
  });
});
