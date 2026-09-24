import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegisterPage extends BasePage {
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly phone: Locator;
  private readonly contactEmail: Locator;
  private readonly address: Locator;
  private readonly city: Locator;
  private readonly state: Locator;
  private readonly postalCode: Locator;
  private readonly country: Locator;
  private readonly userName: Locator;
  private readonly password: Locator;
  private readonly confirmPassword: Locator;
  private readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.locator("input[name='firstName']");
    this.lastName = page.locator("input[name='lastName']");
    this.phone = page.locator("input[name='phone']");
    this.contactEmail = page.locator("input[name='userName']");
    this.address = page.locator("input[name='address1']");
    this.city = page.locator("input[name='city']");
    this.state = page.locator("input[name='state']");
    this.postalCode = page.locator("input[name='postalCode']");
    this.country = page.locator("select[name='country']");
    this.userName = page.locator("input[name='email']");
    this.password = page.locator("input[name='password']");
    this.confirmPassword = page.locator("input[name='confirmPassword']");
    this.submit = page.locator("input[name='submit']");
  }

  async abrir(): Promise<void> {
    await this.goto("register.php");
  }

  async registrar(datos: Record<string, string>): Promise<void> {
    await this.firstName.fill(datos.nombre);
    await this.lastName.fill(datos.apellido);
    await this.phone.fill(datos.telefono);
    await this.contactEmail.fill(datos.mailContacto);
    await this.address.fill(datos.direccion);
    await this.city.fill(datos.ciudad);
    await this.state.fill(datos.provincia);
    await this.postalCode.fill(datos.codigoPostal);
    await this.country.selectOption(datos.pais);
    await this.userName.fill(datos.usuario);
    await this.password.fill(datos.clave);
    await this.confirmPassword.fill(datos.clave);
    await this.submit.click();
  }

  campoNombre(): Locator {
    return this.firstName;
  }

  usuarioCreado(usuario: string): Locator {
    return this.page.getByText(usuario);
  }
}
