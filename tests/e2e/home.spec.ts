import { expect, test } from "@playwright/test";

test("homepage calculator updates and core content is visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Roth Conversion Calculator/i })).toBeVisible();
  await expect(page.getByLabel("Conversion amount")).toBeVisible();
  await expect(page.getByText("Tax Impact Warnings")).toBeVisible();
  await expect(page.getByRole("button", { name: /Share result/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Download report/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Review this estimate in plain English/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: /Primary navigation/i }).getByText("Explanation")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: /Primary navigation/i }).getByText("Sources")).toHaveCount(0);

  const conversionAmount = page.getByLabel("Conversion amount");
  await conversionAmount.click();
  await conversionAmount.press("Control+A");
  await conversionAmount.pressSequentially("75000");
  await expect(conversionAmount).toHaveValue("75000");
  await expect(page.getByLabel("Primary result estimates").getByText("$17,586").first()).toBeVisible();
});
