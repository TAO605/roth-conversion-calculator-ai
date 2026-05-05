import { expect, test } from "@playwright/test";

test("calculator workflow renders advanced analysis modules", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Conversion amount").fill("90000");
  await page.getByLabel("Current taxable income").fill("110000");
  await page.getByLabel("State marginal tax rate").fill("5");

  await expect(page.getByText("Total upfront cost")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Conversion sensitivity" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Federal bracket capacity" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Multi-year conversion schedule" })).toBeVisible();
  await expect(page.getByText("Lump sum")).toBeVisible();
  await expect(page.getByText("5 years")).toBeVisible();
});

test("AI explainer shows a compliant recoverable response when rate limited", async ({ page }) => {
  await page.route("**/api/ai/explain", async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({
        answer:
          "The AI explainer is receiving too many requests from this browser or network. Please wait before trying again.",
      }),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Explain" }).click();

  await expect(page.getByText(/receiving too many requests/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Explain" })).toBeEnabled();
});

test("mobile viewport keeps the primary calculator path usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Roth Conversion Calculator" })).toBeVisible();
  await page.getByLabel("Conversion amount").fill("45000");
  await expect(page.getByText("Total upfront cost")).toBeVisible();
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
