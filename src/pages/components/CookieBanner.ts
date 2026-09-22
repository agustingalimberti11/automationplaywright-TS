import { Page } from "@playwright/test";

export class CookieBanner {
  constructor(private readonly page: Page) {}

  async dismissIfPresent(): Promise<void> {
    const iframe = this.page.locator("iframe#gdpr-consent-notice");
    try {
      await iframe.waitFor({ state: "visible", timeout: 2_000 });
    } catch {
      return;
    }

    await this.page
      .frameLocator("iframe#gdpr-consent-notice")
      .locator("#save")
      .click()
      .catch(() => undefined);
  }
}
