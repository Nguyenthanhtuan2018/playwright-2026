import { Locator, Page } from "@playwright/test";

/** Bảng listing CMS (Ant Design). Bỏ qua measure-row ẩn của ant-table. */
export class DataTable {
  constructor(private readonly page: Page) {}

  rows(): Locator {
    return this.page.locator("tbody tr.ant-table-row");
  }

  rowByText(text: string): Locator {
    return this.rows().filter({ hasText: text });
  }

  cell(row: Locator, index: number): Locator {
    return row.locator("td").nth(index);
  }

  actionButton(row: Locator, title: string): Locator {
    return row.locator(`button[title="${title}"]`);
  }
}
