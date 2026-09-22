import { expect } from "@playwright/test";
import { Given, Then, When } from "../fixtures";

Given("que el usuario abre la home de New Tours", async ({ homePage }) => {
  await homePage.abrir();
});

When("el usuario abre la home de New Tours", async ({ homePage }) => {
  await homePage.abrir();
});

When("va al menu {string}", async ({ homePage }, nombre: string) => {
  await homePage.irAlMenu(nombre);
});

Then("el titulo de la pagina es {string}", async ({ page }, titulo: string) => {
  await expect(page).toHaveTitle(titulo);
});

Then("ve el mensaje {string}", async ({ page }, texto: string) => {
  await expect(page.getByText(texto)).toBeVisible();
});

Then("el menu muestra el enlace {string}", async ({ homePage }, nombre: string) => {
  await expect(homePage.enlaceDelMenu(nombre)).toBeVisible();
});
