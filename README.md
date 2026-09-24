# New Tours + Playwright + TypeScript + Cucumber

Proyecto de automatización web contra la demo [New Tours](https://demo.guru99.com/test/newtours/).

Los escenarios se escriben en **Gherkin** (Cucumber): frases en español que describe el negocio. La ejecución las corre **Playwright Test**, el runner que el mercado usa hoy para Playwright + TypeScript.

Eso es el punto de este repo: **Cucumber para el “qué”**, **Playwright Test para el “cómo se corre”**.

---

## Índice

1. [Por qué este stack](#por-qué-este-stack)
2. [Qué necesitás](#qué-necesitás)
3. [Cómo correrlo](#cómo-correrlo)
4. [Qué pasa cuando corrés `npm test`](#qué-pasa-cuando-corrés-npm-test)
5. [Las capas](#las-capas)
6. [Un escenario de punta a punta](#un-escenario-de-punta-a-punta)
7. [Page Objects y composición](#page-objects-y-composición)
8. [Fixtures](#fixtures)
9. [Locators y aserciones](#locators-y-aserciones)
10. [Tags: smoke y regresión](#tags-smoke-y-regresión)
11. [Si un test falla](#si-un-test-falla)
12. [Entorno y credenciales](#entorno-y-credenciales)
13. [Scripts](#scripts)
14. [CI](#ci)
15. [Cómo agregar un escenario nuevo](#cómo-agregar-un-escenario-nuevo)
16. [API (aún vacío)](#api-aún-vacío)
17. [Mapa de carpetas](#mapa-de-carpetas)
18. [Archivos de configuración](#archivos-de-configuración)

---

## Por qué este stack

Playwright se puede usar de dos maneras:

| Enfoque | Qué es | Problema |
|---|---|---|
| Librería | `chromium.launch()` a mano, detrás de Cucumber JS | Funciona, pero perdés UI Mode, traces, retries, proyectos y el reporter HTML |
| Runner | `@playwright/test` + `playwright.config.ts` | Es lo que documenta Microsoft y lo que espera un equipo hoy |

Este proyecto usa el segundo, **sin tirar Cucumber**.

`playwright-bdd` lee los `.feature`, genera tests nativos de Playwright y los corre con el runner oficial. Los steps siguen siendo `Given` / `When` / `Then`. Los features siguen siendo el contrato de negocio.

```text
negocio lee  →  features/ui/*.feature  (Gherkin, español)
automatizador →  src/ui/steps/*.ts     (une la frase con TypeScript)
Playwright    →  browser, waits, reportes, paralelo
```

Si el negocio cambia, se edita el `.feature`. Si cambia la pantalla, se edita el Page Object. El step casi no se toca.

---

## Qué necesitás

- Node **20+** (recomendado 22)
- npm

---

## Cómo correrlo

```powershell
npm install
npx playwright install chromium
npm test
```

Ver el browser:

```powershell
npm run test:headed
```

UI Mode (el debugger visual de Playwright: ves cada paso, el DOM, el trace):

```powershell
npm run test:ui
```

Solo smoke o solo regresión:

```powershell
npm run test:smoke
npm run test:regresion
```

Reporte HTML de Playwright (después de una corrida):

```powershell
npm run report
```

Allure:

```powershell
npm run allure:serve
```

Tipos y lint (también corren en CI):

```powershell
npm run typecheck
npm run lint
```

Usuario de la demo: `mercury` / `mercury`. Se puede cambiar; ver [Entorno y credenciales](#entorno-y-credenciales).

---

## Qué pasa cuando corrés `npm test`

El script hace **dos pasos**:

```text
bddgen && playwright test
```

### 1. `bddgen`

Lee `features/ui` + `features/api` y los steps de `src/ui` + `src/api`. Genera tests de Playwright en `.features-gen/` (esa carpeta no se sube a git).

Un escenario Gherkin se convierte en un `test('...')` que llama a cada step por su texto.

### 2. `playwright test`

El runner oficial:

- abre Chromium
- crea un **contexto y una página nuevos por escenario** (sesión limpia)
- corre los tests **en paralelo**
- aplica timeouts, screenshots, video y traces según `playwright.config.ts`

No hay un `BrowserManager` estático. El ciclo de vida del browser lo resuelve Playwright.

---

## Las capas

Cada capa responde **una** pregunta. Si una clase empieza a responder dos, está mal de lugar.

```text
npm test
    → bddgen convierte .feature en tests de Playwright
        → playwright test corre esos tests
            → fixtures inyectan Page Objects
                → steps interpretan cada frase
                    → pages / components hablan con la pantalla
                        → Playwright mueve el browser
```

| Capa | Pregunta | Dónde |
|---|---|---|
| Feature UI | ¿Qué tiene que pasar en negocio (web)? | `features/ui/` |
| Feature API | ¿Qué tiene que pasar en negocio (HTTP)? | `features/api/` |
| Config | ¿Cómo se corre (browser, retries, traces)? | `playwright.config.ts` |
| Fixtures UI | ¿Qué page objects recibe este escenario? | `src/ui/fixtures/` |
| Steps UI | ¿Qué TypeScript ejecuta cada frase web? | `src/ui/steps/` |
| Pages | ¿Cómo se hace clic/fill en ESA pantalla? | `src/ui/pages/` |
| Components | ¿Qué pedazo de UI se reutiliza en varias pantallas? | `src/ui/pages/components/` |
| API | Cliente HTTP (cuando exista) | `src/api/` |
| Entorno | ¿A qué URL y con qué usuario? | `.env` / `src/config/env.ts` |

Regla práctica:

- El **feature** no sabe de CSS ni de Playwright.
- El **step** no habla con el DOM (`page.locator` no va acá).
- El **page object** no decide el negocio: solo sabe operar esa pantalla.
- Las **aserciones** (`expect`) viven en el step, no escondidas dentro del page object.
- Una **API no es una page**. El cliente HTTP va en `src/api/`, no en `src/ui/pages/`.

---

## Un escenario de punta a punta

Feature (`features/ui/login.feature`):

```gherkin
@smoke
Escenario: Usuario valido inicia sesion
  Dado que el usuario abre la home de New Tours
  Cuando inicia sesion con el usuario de demo
  Entonces ve el mensaje "Login Successfully"
  Y el menu muestra el enlace "SIGN-OFF"
```

Eso se ejecuta así:

1. `bddgen` genera un test de Playwright con esos cuatro pasos.
2. Playwright abre una página limpia e inyecta las fixtures (`homePage`, `page`, …).
3. El step `Dado que el usuario abre la home...` llama a `homePage.abrir()`.
4. `HomePage` navega con `goto()` (URL de `env.baseURL`) y cierra el banner de cookies si aparece.
5. El step `Cuando inicia sesion con el usuario de demo` llama a `homePage.iniciarSesion(env.demoUser, env.demoPassword)`.
6. `HomePage` hace `fill` en usuario/clave y `click` en submit. Playwright espera solo: no hay `setTimeout`.
7. El `Entonces` usa `expect(page.getByText("Login Successfully")).toBeVisible()`.
8. El `Y` afirma que el menú muestra `SIGN-OFF`.

Si mañana el botón de login cambia de `name='submit'` a un rol `button`, se toca **solo** `HomePage`. El feature y el step siguen iguales.

---

## Page Objects y composición

Un Page Object es la API de **una pantalla**. Adentro tiene locators y métodos de negocio chicos (`abrir`, `iniciarSesion`, `registrar`).

```text
HomePage / RegisterPage / FlightFinderPage
        └── BasePage
                ├── MainMenu          (composición)
                └── CookieBanner      (composición)
```

`BasePage` no es un cajón de helpers sueltos. Solo comparte lo que todas las pantallas de New Tours tienen: ir a una ruta y usar el menú.

El menú y el iframe de cookies **no se heredan como métodos sueltos**. Son objetos (`MainMenu`, `CookieBanner`) que `BasePage` arma y usa. Eso es composición: si el menú cambia, se edita un archivo.

Los formularios largos no se llenan con 11 parámetros. El step pasa la tabla Gherkin con `tabla.rowsHash()` y el page object usa esas claves (`nombre`, `origen`, etc.).

New Tours es HTML viejo: muchos inputs no tienen label usable. Por eso en login/registro se usa `input[name='...']` y no `getByLabel`. Donde sí hay texto o rol (`REGISTER`, `SIGN-OFF`), se usa `getByRole` / `getByText`.

---

## Fixtures

En Playwright, una fixture es “esto que el test necesita, ya listo”.

`src/ui/fixtures/index.ts`:

- extiende el `test` de `playwright-bdd`
- crea `homePage`, `registerPage`, `flightFinderPage` a partir de `page`
- guarda estado chico del escenario en `scenarioData` (por ejemplo el usuario único del registro)
- exporta `Given`, `When`, `Then` atados a esas fixtures

Por eso un step se escribe así:

```ts
When("inicia sesion con el usuario de demo", async ({ homePage }) => {
  await homePage.iniciarSesion(env.demoUser, env.demoPassword);
});
```

`homePage` aparece porque el step lo pide. Playwright no instancia lo que el step no usa.

Cada escenario tiene su propia `page`. Los tests no se pisan entre sí aunque corran en paralelo.

---

## Locators y aserciones

Playwright **auto-espera**: `click`, `fill` y `expect` reintentan hasta el timeout. No hace falta `waitForTimeout`.

Las aserciones son web-first:

```ts
await expect(page).toHaveTitle("Welcome: Mercury Tours");
await expect(page.getByText("Login Successfully")).toBeVisible();
await expect(page).toHaveURL(/reservation2\.php/);
```

Eso es mejor que leer `page.url()` a mano y tirar un `throw`: `toHaveURL` espera a que la navegación termine.

ESLint obliga a no olvidar `await` (`no-floating-promises`). `npm run typecheck` valida los tipos sin emitir JS: Playwright ya transpila TypeScript solo.

---

## Tags: smoke y regresión

Solo hay dos tags, a propósito:

| Tag | Para qué |
|---|---|
| `@smoke` | ¿La app abre y el camino feliz anda? Poco, rápido, en cada push |
| `@regresion` | Más cobertura (login inválido, vuelos, support, …) |

Se ponen arriba del escenario en el `.feature`. Playwright los convierte en tags nativos, por eso `npm run test:smoke` usa `--grep "@smoke"`.

Los datos (nombre, destino, fechas) van **en el feature**, no hardcodeados en el step.

---

## Si un test falla

En local, lo más útil es UI Mode:

```powershell
npm run test:ui
```

Ahí ves el escenario, cada step, el locator y el timeline.

Además, `playwright.config.ts` deja evidencia:

| Qué | Cuándo | Dónde |
|---|---|---|
| Screenshot | solo si falló | `test-results/` |
| Video | se guarda si falló | `test-results/` |
| Trace | en el **retry** (CI) | `test-results/` → se abre con `npx playwright show-trace` |
| HTML report | siempre | `playwright-report/` → `npm run report` |
| Allure | siempre | `allure-results/` → `npm run allure:serve` |

En CI hay **2 reintentos**. El trace se captura en el retry para no pagar el costo en la corrida feliz.

---

## Entorno y credenciales

Los defaults apuntan a la demo pública para que `npm test` ande sin setup.

Si querés cambiar URL o usuario, copiá `.env.example` a `.env`:

```
BASE_URL=https://demo.guru99.com/test/newtours/
DEMO_USER=mercury
DEMO_PASSWORD=mercury
```

`.env` no se sube a git. En CI se pasan las mismas claves como variables de entorno.

La lectura está centralizada en `src/config/env.ts`. Ni los page objects ni los steps deberían tener la URL o la clave escritas a mano.

---

## Scripts

| Script | Qué hace |
|---|---|
| `npm test` | Genera los tests BDD y los corre headless |
| `npm run test:headed` | Igual, con el browser visible |
| `npm run test:ui` | Playwright UI Mode |
| `npm run test:debug` | Inspector de Playwright (paso a paso) |
| `npm run test:smoke` | Solo escenarios `@smoke` |
| `npm run test:regresion` | Solo escenarios `@regresion` |
| `npm run report` | Abre el HTML report de la última corrida |
| `npm run allure:serve` | Sirve Allure |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

Si `CI=true` (Jenkins / GitHub Actions): 2 retries y 2 workers. En local, workers = cantidad de CPU y retries = 0.

---

## CI

**GitHub Actions** (`.github/workflows/playwright.yml`):

1. `npm ci`
2. Instala Chromium
3. `typecheck` + `lint`
4. `npm test`
5. Sube `playwright-report/` y `test-results/` como artefactos

**Jenkins** (`Jenkinsfile`): lo mismo, y publica Allure + el HTML report.

La tool de Node en Jenkins se llama `node22`. Si en tu servidor tiene otro nombre, hay que cambiarlo.

---

## Cómo agregar un escenario nuevo

1. Escribí el escenario en un `.feature` (web en `features/ui/`, HTTP en `features/api/`).
2. Corré `npm test`. Si falta un step, Playwright-BDD te dice la frase que no matchea.
3. Agregá el `Given` / `When` / `Then` en `src/ui/steps/` (o `src/api/steps/`), usando fixtures (`homePage`, `page`, …).
4. Si la pantalla aún no existe, creá un Page Object en `src/ui/pages/` y registralo en `src/ui/fixtures/index.ts`.
5. Poné `@smoke` o `@regresion`.
6. No pongas locators en el step.

Ese es el orden a propósito: primero el negocio, después el pegamento, al final el DOM.

---

## API (aún vacío)

Las carpetas ya están creadas para cuando quieras automatizar HTTP. Playwright trae `request` (`APIRequestContext`): no hace falta Rest Assured ni SuperTest.

| Carpeta | Qué va ahí | Equivale en UI a |
|---|---|---|
| `features/api/` | `.feature` de contratos HTTP | `features/ui/` |
| `src/api/` | cliente HTTP (GET/POST, headers, token) | `src/ui/pages/` |
| `src/api/steps/` | `Given` / `When` / `Then` que llaman al cliente | `src/ui/steps/` |

Hoy no hay código adentro (solo `.gitkeep` para que Git no ignore la carpeta vacía). Cuando empieces:

1. Un cliente en `src/api/`, por ejemplo `src/api/usuarios.ts`, usando `request` de Playwright.
2. Lo inyectás como fixture (podés crear `src/api/fixtures.ts` o extender el test de UI).
3. Steps en `src/api/steps/`.
4. Escenarios en `features/api/`.

`playwright.config.ts` ya apunta a `features/ui` + `features/api` y a los steps de ambos lados.

---

## Mapa de carpetas

```text
automationplaywright-ts/
├── playwright.config.ts                 runner: browsers, traces, retries, reporters
├── package.json                         scripts y librerías
├── tsconfig.json                        TypeScript estricto, sin emitir JS
├── eslint.config.mjs                    lint + no-floating-promises
├── .env.example                         plantilla de URL / usuario
├── Jenkinsfile
├── .github/workflows/playwright.yml
├── features/
│   ├── api/                             reservado: Gherkin HTTP
│   └── ui/                              Gherkin web
│       ├── login.feature
│       ├── registro.feature
│       ├── navegacion.feature
│       └── vuelos.feature
└── src/
    ├── api/                             reservado: cliente y steps HTTP
    │   └── steps/
    ├── config/env.ts                    BASE_URL, DEMO_USER, DEMO_PASSWORD
    └── ui/
        ├── fixtures/index.ts            test.extend + Given / When / Then
        ├── pages/
        │   ├── BasePage.ts
        │   ├── HomePage.ts
        │   ├── RegisterPage.ts
        │   ├── FlightFinderPage.ts
        │   └── components/
        └── steps/
            ├── common.steps.ts
            ├── login.steps.ts
            ├── registro.steps.ts
            └── vuelos.steps.ts
```

`.features-gen/` aparece después de `bddgen`. Es código generado: no se edita a mano.

---

## Archivos de configuración

### `package.json`

Equivale al `pom.xml` del mundo Java.

- **`scripts`**: todo se corre con `npm run ...`. El test siempre hace `bddgen` antes, para no correr features viejos.
- **`devDependencies`**: esto es un repo de tests, no hay dependencias de producción.
  - `@playwright/test`: runner, `expect`, browsers
  - `playwright-bdd`: Gherkin → tests de Playwright
  - `dotenv`: lee `.env`
  - `allure-playwright` + `allure-commandline`: reporte Allure
  - `eslint` / `typescript-eslint` / `eslint-plugin-playwright`: calidad
  - `typescript`: tipos

### `playwright.config.ts`

La fuente de verdad de **cómo** se corre. Ya no se lanza Chromium en un hook.

| Opción | Para qué |
|---|---|
| `defineBddConfig` | Dónde están features y steps; idioma `es`; salida `.features-gen` |
| `baseURL` | Sale de `env.baseURL` |
| `fullyParallel` | Escenarios en paralelo |
| `retries` | 2 en CI, 0 en local |
| `trace` | `on-first-retry` |
| `screenshot` / `video` | solo si falló |
| `reporter` | consola + HTML + Allure |
| `projects` | hoy solo Chromium (Desktop Chrome) |

Para sumar Firefox o WebKit, se agrega otro objeto en `projects`. No hace falta tocar los steps.

### `tsconfig.json`

`strict: true`, `noEmit: true`. Playwright transpila en caliente; `tsc --noEmit` solo controla que los tipos cierren.

### `eslint.config.mjs`

Atrapa `await` faltantes y usos raros de la API de Playwright. En los steps se apaga `no-standalone-expect` porque el `expect` vive dentro de `Given`/`Then`, no dentro de un `test()` escrito a mano.

### `.gitignore`

No sube `node_modules/`, `.env`, `.features-gen/`, `playwright-report/`, `test-results/`, `allure-results/` ni basura del IDE.
