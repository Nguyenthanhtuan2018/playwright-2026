# CMS E2E (Playwright)

UI automation cho CMS Loyalty portal. Auth Keycloak một lần mỗi lần chạy, spec dùng Page Object + fixture.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Điền `CMS_USER` và `CMS_PASSWORD` trong `.env`. Không commit file này.

```
CMS_BASE_URL=https://portal.shb.whitelabel.taptap.vn
CMS_USER=
CMS_PASSWORD=
```

## Chạy test

```bash
npm test              # toàn bộ
npm run test:smoke    # tag @smoke
npm run test:headed   # hiện browser
npm run test:ui       # Playwright UI mode
```

Sau khi chạy, HTML report nằm ở `playwright-report/`. Session login được ghi vào `auth/.auth/user.json` (đã gitignore).

## Cấu trúc

```
playwright.config.ts          # setup → cms, storageState
.env.example
auth/.auth/                   # session, không commit
src/
  config/env.ts               # đọc env một chỗ
  fixtures/cms.fixture.ts     # page objects dùng chung
  pages/
    base.page.ts              # sidebar, toast
    auth/login.page.ts
    reward/                   # page theo module CMS
  components/                 # FilterBar, DataTable — tái dùng listing
  data/factories/             # data AUTO_*, unique theo timestamp
tests/
  auth.setup.ts               # login 1 lần / job
  smoke/
  reward/
```

Luồng: `.env` → `auth.setup` → `user.json` → spec → Page Object → CMS.

Spec import `{ test, expect }` từ `src/fixtures/cms.fixture.ts`, không từ `@playwright/test`.

## Tag

| Tag | Dùng cho |
|---|---|
| `@smoke` | Login, mở listing, tạo collection happy path |
| `@regression` | Validation, case lệch happy path |

## Thêm module CMS mới

Copy pattern Reward Collection:

1. `src/pages/<module>/` — page object, selector chỉ nằm ở đây
2. `src/data/factories/<entity>.factory.ts` — data prefix `AUTO_`
3. `tests/<module>/*.spec.ts` — 1 spec = 1 hành vi
4. Đăng ký page trong `src/fixtures/cms.fixture.ts` nếu nhiều spec dùng chung

Nguyên tắc:

- Selector không viết trực tiếp trong spec
- Record auto dùng prefix `AUTO_` để khỏi đụng data tạo tay
- Auth hiện 1 user (`user.json`). Thêm role sau: project/setup mới + `storageState` riêng
