function leerEnv(nombre: string, fallback: string): string {
  const valor = process.env[nombre];
  if (valor !== undefined && valor.trim() !== "") {
    return valor.trim();
  }
  return fallback;
}

/**
 * Configuración de entorno. Los defaults apuntan a la demo pública
 * para que `npm test` funcione sin setup. En CI se sobreescriben con env vars.
 */
export const env = {
  baseURL: leerEnv("BASE_URL", "https://demo.guru99.com/test/newtours/"),
  demoUser: leerEnv("DEMO_USER", "mercury"),
  demoPassword: leerEnv("DEMO_PASSWORD", "mercury"),
} as const;
