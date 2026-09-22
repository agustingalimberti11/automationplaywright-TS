import { createBdd, test as base } from "playwright-bdd";
import { FlightFinderPage } from "../pages/FlightFinderPage";
import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegisterPage";

export type ScenarioData = {
  usuarioCreado?: string;
};

type Fixtures = {
  homePage: HomePage;
  registerPage: RegisterPage;
  flightFinderPage: FlightFinderPage;
  scenarioData: ScenarioData;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  flightFinderPage: async ({ page }, use) => {
    await use(new FlightFinderPage(page));
  },
  scenarioData: async ({ page: _page }, use) => {
    await use({});
  },
});

export const { Given, When, Then } = createBdd(test);
