import { test, expect } from "../../src/fixtures/cms.fixture";

test("CMS home sau login @smoke", async ({ page }) => {
  await page.goto("/cms/");
  await expect(page).toHaveURL(/\/cms/);
  await expect(page.getByRole("heading", { name: /welcome to cms/i })).toBeVisible();
});
