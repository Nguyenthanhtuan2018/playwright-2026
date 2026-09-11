import { defineConfig, devices } from "@playwright/test";
import { loadDotEnv } from "./src/config/env";

loadDotEnv();

/**
 * Thêm module CMS mới:
 * 1. src/pages/<module>/
 * 2. src/data/factories/<entity>.factory.ts
 * 3. tests/<module>/*.spec.ts
 * 4. Đăng ký page trong src/fixtures/cms.fixture.ts nếu nhiều spec dùng chung
 *
 * Auth 1 user (user.json). Thêm role sau: project/setup mới + storageState riêng.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.CMS_BASE_URL ?? "https://portal.shb.whitelabel.taptap.vn",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "cms",
      dependencies: ["setup"],
      testIgnore: /auth\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "auth/.auth/user.json",
      },
    },
  ],
});
