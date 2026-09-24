import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import "dotenv/config";
import { env } from "./src/config/env";

const testDir = defineBddConfig({
  features: ["features/ui/**/*.feature", "features/api/**/*.feature"],
  steps: ["src/ui/fixtures/index.ts", "src/ui/steps/**/*.ts", "src/api/steps/**/*.ts"],
  language: "es",
  outputDir: ".features-gen",
});

const enCI = !!process.env.CI;

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: enCI,
  retries: enCI ? 2 : 0,
  workers: enCI ? 2 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["allure-playwright", { resultsDir: "allure-results" }],
  ],
  use: {
    baseURL: env.baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
