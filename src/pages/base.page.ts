import { Locator, Page, expect } from "@playwright/test";

/** Chrome CMS: sidebar, toast, header. Mọi page nghiệp vụ kế thừa class này. */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/cms/");
  }

  async openMenu(group: string, item: string): Promise<void> {
    const itemLink = this.page.getByRole("link", { name: item, exact: true });
    if (await itemLink.isVisible().catch(() => false)) {
      await itemLink.click();
      return;
    }
    await this.page.getByRole("link", { name: group, exact: true }).click();
    await itemLink.click();
  }

  toast(): Locator {
    return this.page.getByRole("alert").or(this.page.locator("[class*='toast']"));
  }

  async expectToast(text: string | RegExp): Promise<void> {
    await expect(this.page.getByText(text).first()).toBeVisible({ timeout: 15_000 });
  }
}
