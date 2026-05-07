import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.PORT ?? 3500)

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : [["list"]],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Spin up the production server during e2e. The build step is the user's
  // responsibility (`npm run build`) — Playwright will wait for it to be
  // reachable before launching the suite.
  webServer: {
    command: `PORT=${PORT} npm run start`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
    timeout: 60_000,
  },
})
