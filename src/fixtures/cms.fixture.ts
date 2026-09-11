import { test as base } from "@playwright/test";
import { CollectionListPage } from "../pages/reward/collection-list.page";
import { CollectionCreatePage } from "../pages/reward/collection-create.page";

/**
 * Fixture CMS. Thêm page module mới vào type CmsFixtures rồi khởi tạo bên dưới.
 * Spec import { test, expect } từ file này, không từ @playwright/test.
 */
type CmsFixtures = {
  collectionList: CollectionListPage;
  collectionCreate: CollectionCreatePage;
};

export const test = base.extend<CmsFixtures>({
  collectionList: async ({ page }, use) => {
    await use(new CollectionListPage(page));
  },
  collectionCreate: async ({ page }, use) => {
    await use(new CollectionCreatePage(page));
  },
});

export { expect } from "@playwright/test";
