import { Locator, Page } from "@playwright/test";
import { env } from "../../config/env";
import { CookieBanner } from "./components/CookieBanner";
import { MainMenu } from "./components/MainMenu";

export class BasePage {
  readonly menu: MainMenu;
  protected readonly cookies: CookieBanner;

  constructor(protected readonly page: Page) {
    this.menu = new MainMenu(page);
    this.cookies = new CookieBanner(page);
  }

  protected async goto(ruta = ""): Promise<void> {
    const base = env.baseURL.endsWith("/") ? env.baseURL : `${env.baseURL}/`;
    const url = ruta ? `${base}${ruta.replace(/^\//, "")}` : base;
    await this.page.goto(url);
    await this.cookies.dismissIfPresent();
  }

  async irAlMenu(nombre: string): Promise<void> {
    await this.menu.irA(nombre);
    await this.cookies.dismissIfPresent();
  }

  enlaceDelMenu(nombre: string): Locator {
    return this.menu.enlace(nombre);
  }
}
