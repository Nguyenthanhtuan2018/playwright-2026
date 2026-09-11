import path from "path";
import { Locator, Page } from "@playwright/test";
import { BasePage } from "../base.page";
import { CollectionDraft } from "../../data/factories/collection.factory";

export class CollectionCreatePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /** Form CMS dùng Ant Design, label không gắn `for` nên phải lấy control kề sau label. */
  private fieldAfterLabel(label: string, tag: "input" | "textarea" = "input"): Locator {
    return this.page.locator(
      `xpath=//label[contains(normalize-space(.), "${label}")]/following::${tag}[1]`,
    );
  }

  nameInput(): Locator {
    return this.fieldAfterLabel("Collection Name");
  }

  codeInput(): Locator {
    return this.fieldAfterLabel("Collection Code");
  }

  indexInput(): Locator {
    return this.fieldAfterLabel("Index");
  }

  descriptionInput(): Locator {
    return this.fieldAfterLabel("Description", "textarea");
  }

  fileInput(): Locator {
    return this.page.locator('input[type="file"]');
  }

  /** Dòng lỗi đỏ dưới field. CMS render `<div class="... text-red-600">`, không phải ant-form-item-explain. */
  fieldError(message: string | RegExp): Locator {
    return this.page.locator("div.text-red-600").filter({ hasText: message });
  }

  submitButton(): Locator {
    return this.page.locator('button[title="Create"]');
  }

  cancelButton(): Locator {
    return this.page.locator('button[title="Cancel"]');
  }

  async fill(draft: CollectionDraft): Promise<void> {
    await this.nameInput().fill(draft.name);
    await this.codeInput().fill(draft.code);
    await this.indexInput().fill(String(draft.index));
    if (draft.description) await this.descriptionInput().fill(draft.description);
    await this.uploadImage(draft.imagePath);
  }

  /** Ảnh upload lên server bằng request riêng; bấm Create sớm hơn thì form bị chặn. */
  async uploadImage(imagePath: string): Promise<void> {
    const uploaded = this.page.waitForResponse(
      (res) => res.url().includes("/resource/media/image") && res.request().method() === "POST",
    );
    await this.fileInput().setInputFiles(path.resolve(imagePath));
    await uploaded;
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }

  /** Bấm Create và chờ API tạo collection trả về. */
  async submitAndWait(): Promise<number> {
    const created = this.page.waitForResponse(
      (res) => res.url().includes("/cms/reward/collection") && res.request().method() === "POST",
    );
    await this.submit();
    return (await created).status();
  }
}
