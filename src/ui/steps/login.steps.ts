import { expect } from "@playwright/test";
import { env } from "../../config/env";
import { Then, When } from "../fixtures";

When("inicia sesion con el usuario de demo", async ({ homePage }) => {
  await homePage.iniciarSesion(env.demoUser, env.demoPassword);
});

When("inicia sesion con {string} y {string}", async ({ homePage }, usuario: string, clave: string) => {
  await homePage.iniciarSesion(usuario, clave);
});

Then("el formulario de login es visible", async ({ homePage }) => {
  await expect(homePage.campoUsuario()).toBeVisible();
});
