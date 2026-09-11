import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base.page";
import { DataTable } from "../../components/data-table";
import { FilterBar } from "../../components/filter-bar";

/** Cột của bảng Reward Collection, dùng cho DataTable.cell(). */
const COLUMN = {
  no: 0,
  name: 1,
  code: 2,
  rewards: 3,
  index: 4,
  updatedAt: 5,
  status: 6,
  actions: 7,
} as const;

export class CollectionListPage extends BasePage {
  readonly filters: FilterBar;
  readonly table: DataTable;

  constructor(page: Page) {
    super(page);
    this.filters = new FilterBar(page);
    this.table = new DataTable(page);
  }

  async gotoList(): Promise<void> {
    await this.page.goto("/cms/reward-collections");
  }

  async openFromMenu(): Promise<void> {
    await this.open();
    await this.openMenu("Reward", "Reward Collection");
  }

  createButton(): Locator {
    return this.page.locator('button[title="Create"]');
  }

  async openCreate(): Promise<void> {
    await this.createButton().click();
    await this.page.waitForURL(/\/reward-collections\/create/);
  }

  rowByCode(code: string): Locator {
    return this.table.rowByText(code);
  }

  statusOf(row: Locator): Locator {
    return this.table.cell(row, COLUMN.status);
  }

  nameOf(row: Locator): Locator {
    return this.table.cell(row, COLUMN.name);
  }
}
