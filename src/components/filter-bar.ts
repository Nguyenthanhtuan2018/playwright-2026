import { Locator, Page } from "@playwright/test";

/** Thanh filter listing CMS: Name + Status + Search. Tái dùng cho Topup/Segment/… */
export class FilterBar {
  constructor(private readonly page: Page) {}

  nameInput(): Locator {
    return this.page.locator("#name");
  }

  statusSelect(): Locator {
    return this.page.locator("#status");
  }

  searchButton(): Locator {
    return this.page.locator('button[title="Search"]');
  }

  async searchByName(name: string): Promise<void> {
    await this.nameInput().fill(name);
    await this.searchButton().click();
  }
}
