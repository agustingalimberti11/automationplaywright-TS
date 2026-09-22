import { expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { Given, Then, When } from "../fixtures";
import { datosRegistroDesdeTabla } from "../utils/data-table";

Given("que el usuario abre la pagina de registro", async ({ registerPage }) => {
  await registerPage.abrir();
});

When("completa el registro con:", async ({ registerPage, scenarioData }, tabla: DataTable) => {
  const datos = datosRegistroDesdeTabla(tabla);
  const usuario = `${datos.usuario}${Date.now()}`;
  scenarioData.usuarioCreado = usuario;
  await registerPage.registrar({ ...datos, usuario });
});

Then("ve el nombre de usuario creado", async ({ registerPage, scenarioData }) => {
  const usuario = scenarioData.usuarioCreado;
  if (!usuario) {
    throw new Error("No hay usuario creado en este escenario");
  }
  await expect(registerPage.usuarioCreado(usuario)).toBeVisible();
});

Then("el campo nombre del registro es visible", async ({ registerPage }) => {
  await expect(registerPage.campoNombre()).toBeVisible();
});
