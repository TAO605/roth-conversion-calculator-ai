import { expect, test } from "@playwright/test";

test("homepage calculator updates and core content is visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Roth Conversion Calculator" })).toBeVisible();
  await expect(page.getByLabel("Conversion amount")).toBeVisible();
  await expect(page.getByText("Tax Impact Warnings")).toBeVisible();
  await expect(page.getByRole("button", { name: /Share result/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Download report/i })).toBeVisible();
  await expect(page.getByText("AI Roth Conversion Explainer")).toBeVisible();
  await expect(page.getByText("Roth Conversion FAQ")).toBeVisible();

  await page.getByLabel("Conversion amount").fill("75000");
  await expect(page.getByText("Total upfront cost")).toBeVisible();
});
