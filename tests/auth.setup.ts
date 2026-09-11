import fs from "fs";
import path from "path";
import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/auth/login.page";

const authFile = path.resolve(__dirname, "../auth/.auth/user.json");

setup("authenticate cms user", async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await new LoginPage(page).loginAs();
  await expect(page).toHaveURL(/\/cms/);
  await page.context().storageState({ path: authFile });
});
