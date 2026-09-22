import { expect } from "@playwright/test";
import { DataTable } from "playwright-bdd";
import { Given, Then, When } from "../fixtures";
import { datosVueloDesdeTabla } from "../utils/data-table";

Given("que el usuario abre el buscador de vuelos", async ({ flightFinderPage }) => {
  await flightFinderPage.abrir();
});

Then("el buscador de vuelos es visible", async ({ flightFinderPage }) => {
  await expect(flightFinderPage.radioIda()).toBeVisible();
  await expect(flightFinderPage.comboOrigen()).toBeVisible();
});

When("busca un vuelo con:", async ({ flightFinderPage }, tabla: DataTable) => {
  await flightFinderPage.buscarVuelo(datosVueloDesdeTabla(tabla));
});

Then("la url contiene {string}", async ({ page }, fragmento: string) => {
  await expect(page).toHaveURL(new RegExp(escapeRegExp(fragmento)));
});

function escapeRegExp(valor: string): string {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
