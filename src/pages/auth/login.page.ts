import { Page, expect } from "@playwright/test";
import { env } from "../../config/env";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async loginAs(user?: string, password?: string): Promise<void> {
    const creds = env();
    await this.page.goto(`${creds.baseURL}/cms/`);

    const username = user ?? creds.user;
    const pass = password ?? creds.password;

    await this.page.getByLabel(/username or email/i).fill(username);
    await this.page.getByLabel(/^password$/i).fill(pass);
    await this.page.getByRole("button", { name: /sign in/i }).click();

    await expect(this.page).toHaveURL(/\/cms/, { timeout: 30_000 });
    await expect(this.page.getByRole("heading", { name: /welcome to cms/i })).toBeVisible({
      timeout: 30_000,
    });
  }
}
