import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  globalTeardown: "./e2e/teardown.js",
  timeout: 30000,
  use: { baseURL: "http://127.0.0.1:3101", trace: "retain-on-failure" },
  webServer: {
    command: "node ../backend/test/support/browserServer.js",
    url: "http://127.0.0.1:3101/api/health",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
