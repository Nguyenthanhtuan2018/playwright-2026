import { test, expect } from "../../src/fixtures/cms.fixture";
import { newCollection } from "../../src/data/factories/collection.factory";

test.describe("Reward Collection create", () => {
  test("tạo collection rồi search theo code @smoke", async ({
    collectionList,
    collectionCreate,
  }) => {
    const draft = newCollection();

    await collectionList.gotoList();
    await collectionList.openCreate();
    await collectionCreate.fill(draft);
    expect(await collectionCreate.submitAndWait()).toBe(201);
    await collectionCreate.expectToast(/collection is created/i);

    await collectionList.filters.searchByName(draft.name);
    const row = collectionList.rowByCode(draft.code);
    await expect(row).toBeVisible();
    await expect(collectionList.statusOf(row)).toHaveText(/disabled/i);
  });

  test("không lưu khi thiếu Collection Name @regression", async ({
    collectionList,
    collectionCreate,
    page,
  }) => {
    const draft = newCollection();

    await collectionList.gotoList();
    await collectionList.openCreate();
    await collectionCreate.codeInput().fill(draft.code);
    await collectionCreate.indexInput().fill(String(draft.index));
    await collectionCreate.uploadImage(draft.imagePath);
    await collectionCreate.submit();

    await expect(collectionCreate.fieldError(/collection name is required/i)).toBeVisible();
    await expect(page).toHaveURL(/\/reward-collections\/create/);
  });
});
