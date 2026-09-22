import { Locator, Page } from "@playwright/test";

export class MainMenu {
  constructor(private readonly page: Page) {}

  enlace(nombre: string): Locator {
    return this.page.getByRole("link", { name: nombre, exact: true });
  }

  async irA(nombre: string): Promise<void> {
    await this.enlace(nombre).click();
  }
}
