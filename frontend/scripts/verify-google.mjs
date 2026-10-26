// Optional live provider check. Uses one address prediction query; no data is saved.
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { chromium } from "@playwright/test";

const env = parseEnv(await readFile(new URL("../.env.local", import.meta.url), "utf8"));
const key = process.env.VITE_GOOGLE_MAPS_API_KEY || env.VITE_GOOGLE_MAPS_API_KEY;
if (!key) throw new Error("Configure VITE_GOOGLE_MAPS_API_KEY first.");
const loader = (await readFile(new URL("../src/lib/googlePlaces.js", import.meta.url), "utf8")).replace("import.meta.env.VITE_GOOGLE_MAPS_API_KEY", JSON.stringify(key));
const server = createServer((req, res) => {
  if (req.url === "/loader.js") { res.writeHead(200, { "Content-Type": "text/javascript" }); res.end(loader); return; }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end('<!doctype html><html><body><h1>Address search verification</h1><script type="module">import {loadGooglePlaces} from "/loader.js";loadGooglePlaces().then(({PlaceAutocompleteElement})=>document.body.appendChild(new PlaceAutocompleteElement())).catch(()=>{});</script></body></html>');
});
let browser;
let page;
let providerError = "";
let networkError = "";
try {
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(5173, "127.0.0.1", resolve); });
  browser = await chromium.launch();
  page = await browser.newPage();
  page.on("requestfailed", (request) => { if (new URL(request.url()).hostname.endsWith("googleapis.com")) networkError = request.failure()?.errorText || "Network failure"; });
  page.on("console", (message) => {
    const match = message.text().match(/(?:Google Maps JavaScript API (?:error|warning):\s*)(\w+)/);
    if (match) providerError = match[1];
  });
  await page.goto("http://127.0.0.1:5173");
  await page.locator("gmp-place-autocomplete").click({ timeout: 20000 });
  await page.keyboard.type("Baner Pune");
  try {
    await page.getByRole("option").first().waitFor({ timeout: 15000 });
    console.log("Google autocomplete: live address suggestions verified at http://127.0.0.1:5173.");
  } catch {
    await mkdir(new URL("../test-results/", import.meta.url), { recursive: true });
    await page.screenshot({ path: fileURLToPath(new URL("../test-results/google-live.png", import.meta.url)), fullPage: true });
    console.log(`Google autocomplete: suggestions unavailable${providerError ? ` (${providerError})` : "; check API enablement, billing and allowed referrers"}.`);
    process.exitCode = 1;
  }
} catch (error) {
  console.log(`Google autocomplete check could not finish (${providerError || networkError || error.code || error.name}). ${error.code === "EADDRINUSE" ? "Stop Vite before running this check." : "Check Google API access and network connectivity."}`);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
