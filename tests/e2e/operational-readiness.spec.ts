import { expect, test } from "@playwright/test";

test("calculator workflow renders advanced analysis modules", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Conversion amount").fill("90000");
  await page.getByLabel("Current taxable income").fill("110000");
  await page.getByLabel("State marginal tax rate").fill("5");

  await expect(page.getByText("Estimated upfront tax")).toBeVisible();
  await page.getByText("Advanced calculation details").click();
  await expect(page.getByRole("heading", { name: "Calculation Breakdown" })).toBeVisible();
  await expect(page.getByText("Total upfront cost rate")).toBeVisible();
  await expect(page.getByText("$26,100 total upfront cost / $90,000 converted")).toBeVisible();
});

test("AI explainer module stays usable and visibly compliant", async ({ page }) => {
  await page.goto("/");
  const questionBox = page.getByLabel("Ask the explanation assistant a Roth conversion education question");
  const explainButton = page.getByRole("button", { name: "Explain" });

  await expect(page.getByRole("heading", { name: "Review this estimate in plain English" })).toBeVisible();
  await expect(questionBox).toBeVisible();
  await expect(questionBox).toHaveValue("What does my break-even year mean?");
  await expect(explainButton).toBeVisible();
  await expect(explainButton).toBeEnabled();
  await expect(
    page.locator("#ai-explainer").getByText(/does not constitute tax, financial, legal, or investment advice/i),
  ).toBeVisible();
});

test("mobile viewport keeps the primary calculator path usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Roth Conversion Calculator" })).toBeVisible();
  await page.getByLabel("Conversion amount").fill("45000");
  await expect(page.getByText("Estimated upfront tax")).toBeVisible();
  await expect(page.getByRole("button", { name: /Share result/i })).toBeVisible();
});

test("SEO content pages expose crawlable headings and calculator links", async ({ page }) => {
  await page.goto("/blog/roth-conversion-tax-brackets-2026");
  await expect(page.getByRole("heading", { name: /Roth Conversion Tax Brackets in 2026/i })).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached();

  await page.goto("/states/california");
  await expect(page.getByRole("heading", { name: /California/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Use this state rate" })).toHaveAttribute("href", /#.+/);
});
