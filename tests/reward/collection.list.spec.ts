import { test, expect } from "../../src/fixtures/cms.fixture";

test.describe("Reward Collection listing", () => {
  test("mở listing từ URL @smoke", async ({ collectionList, page }) => {
    await collectionList.gotoList();
    await expect(page).toHaveURL(/\/cms\/reward-collections/);
    await expect(collectionList.createButton()).toBeVisible();
    await expect(collectionList.filters.searchButton()).toBeVisible();
  });
});
