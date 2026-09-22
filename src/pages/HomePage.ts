import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  private readonly userName: Locator;
  private readonly password: Locator;
  private readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.userName = page.locator("input[name='userName']");
    this.password = page.locator("input[name='password']");
    this.submit = page.locator("input[name='submit']");
  }

  async abrir(): Promise<void> {
    await this.goto();
  }

  async iniciarSesion(usuario: string, clave: string): Promise<void> {
    await this.userName.fill(usuario);
    await this.password.fill(clave);
    await this.submit.click();
  }

  campoUsuario(): Locator {
    return this.userName;
  }
}
