import { Locator, Page } from "@playwright/test";
import { DatosVuelo } from "../types/dominio";
import { BasePage } from "./BasePage";

export class FlightFinderPage extends BasePage {
  private readonly oneWay: Locator;
  private readonly roundTrip: Locator;
  private readonly passengers: Locator;
  private readonly fromPort: Locator;
  private readonly fromMonth: Locator;
  private readonly fromDay: Locator;
  private readonly toPort: Locator;
  private readonly toMonth: Locator;
  private readonly toDay: Locator;
  private readonly coach: Locator;
  private readonly business: Locator;
  private readonly first: Locator;
  private readonly airline: Locator;
  private readonly findFlights: Locator;

  constructor(page: Page) {
    super(page);
    this.oneWay = page.locator("input[name='tripType'][value='oneway']");
    this.roundTrip = page.locator("input[name='tripType'][value='roundtrip']");
    this.passengers = page.locator("select[name='passCount']");
    this.fromPort = page.locator("select[name='fromPort']");
    this.fromMonth = page.locator("select[name='fromMonth']");
    this.fromDay = page.locator("select[name='fromDay']");
    this.toPort = page.locator("select[name='toPort']");
    this.toMonth = page.locator("select[name='toMonth']");
    this.toDay = page.locator("select[name='toDay']");
    this.coach = page.locator("input[name='servClass'][value='Coach']");
    this.business = page.locator("input[name='servClass'][value='Business']");
    this.first = page.locator("input[name='servClass'][value='First']");
    this.airline = page.locator("select[name='airline']");
    this.findFlights = page.locator("input[name='findFlights']");
  }

  async abrir(): Promise<void> {
    await this.goto("reservation.php");
  }

  async buscarVuelo(datos: DatosVuelo): Promise<void> {
    if (datos.tipo.toLowerCase() === "oneway") {
      await this.oneWay.check();
    } else {
      await this.roundTrip.check();
    }

    await this.passengers.selectOption(datos.pasajeros);
    await this.fromPort.selectOption(datos.origen);
    await this.fromMonth.selectOption(datos.mesIda);
    await this.fromDay.selectOption(datos.diaIda);
    await this.toPort.selectOption(datos.destino);
    await this.toMonth.selectOption(datos.mesVuelta);
    await this.toDay.selectOption(datos.diaVuelta);

    switch (datos.clase.toLowerCase()) {
      case "business":
        await this.business.check();
        break;
      case "first":
        await this.first.check();
        break;
      default:
        await this.coach.check();
        break;
    }

    await this.airline.selectOption(datos.aerolinea);
    await this.findFlights.click();
  }

  radioIda(): Locator {
    return this.oneWay;
  }

  comboOrigen(): Locator {
    return this.fromPort;
  }
}
