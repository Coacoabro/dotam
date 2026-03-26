import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const HERO_JSON_PATH = new URL("../json/dota2heroes.json", import.meta.url);

// IMPORTANT: update if your local dev host differs
const BASE = "http://localhost:3000";

// Your real route pattern (from your example)
const heroUrl = (slug) => `${BASE}/hero/${slug}/builds`;

// Concurrency: higher = faster, but can overwhelm your dev server
const CONCURRENCY = 4;

// If your app shows a custom 404 page inside the app shell, put a phrase here.
// Examples: "Page Not Found", "404", "Not Found", "This page could not be found"
const NOT_FOUND_TEXT = "Page Not Found";

// This should be something that appears on a *working* builds page.
// Best: add a stable attribute in your page like: <main data-page="hero-builds" />
// then set SUCCESS_SELECTOR = '[data-page="hero-builds"]'
const SUCCESS_SELECTOR = "h1";

// Timeouts
const NAV_TIMEOUT_MS = 20000;
const RENDER_WAIT_MS = 1500;
const SELECTOR_TIMEOUT_MS = 8000;

// Noisy requests you usually don't want to treat as a "broken hero page"
function isNoise(url) {
  return (
    url.includes("favicon") ||
    url.includes("robots.txt") ||
    url.includes("sitemap") ||
    url.includes("google-analytics") ||
    url.includes("googletagmanager") ||
    url.includes("doubleclick") ||
    url.includes("hotjar") ||
    url.includes("clarity") ||
    url.includes("ads") ||
    url.includes("analytics")
  );
}

function readHeroes() {
  const raw = fs.readFileSync(HERO_JSON_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("Hero JSON must be an array");
  // Expect objects like { url, id, name }
  return parsed
    .filter((h) => h && typeof h.url === "string")
    .map((h) => ({ id: h.id, name: h.name, slug: h.url }));
}

async function run() {
  const heroes = readHeroes();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const failed = [];
  let idx = 0;

  async function worker() {
    while (idx < heroes.length) {
      const hero = heroes[idx++];
      const url = heroUrl(hero.slug);
      const page = await context.newPage();

      const runtimeErrors = [];
      const reqFailures = [];

      page.on("pageerror", (e) => runtimeErrors.push(e.message));
      page.on("requestfailed", (req) => {
        const rurl = req.url();
        if (isNoise(rurl)) return;
        reqFailures.push({
          url: rurl,
          method: req.method(),
          failure: req.failure()?.errorText || "FAILED",
        });
      });

      try {
        const resp = await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: NAV_TIMEOUT_MS,
        });

        const status = resp ? resp.status() : "NO_RESPONSE";

        // Give client-side data fetch/render a moment
        await page.waitForTimeout(RENDER_WAIT_MS);

        // Detect your in-app NotFound UI (string match).
        // If your NotFound page uses different text, change NOT_FOUND_TEXT above.
        const notFoundVisible =
          NOT_FOUND_TEXT &&
          (await page.getByText(NOT_FOUND_TEXT, { exact: false }).count()) > 0;

        // Confirm the builds page rendered something we expect
        let hasSuccessSelector = true;
        try {
          await page.waitForSelector(SUCCESS_SELECTOR, { timeout: SELECTOR_TIMEOUT_MS });
        } catch {
          hasSuccessSelector = false;
        }

        // If Next renders a framework 404, it may still return 200.
        // So we treat "notFoundVisible" or missing success selector as failure.
        const routeBad = status === 404 || status === 500;

        const hardFail =
          routeBad ||
          runtimeErrors.length > 0 ||
          notFoundVisible ||
          !hasSuccessSelector;

        if (hardFail) {

          failed.push({
            id: hero.id,
            hero: hero.name,
            runtimeErrors: runtimeErrors.slice(0, 2).join(" | ")
          });
        }
      } catch (e) {
        failed.push({
          id: hero.id,
          hero: hero.name,
          runtimeErrors: String(e).slice(0, 200)
        });
      } finally {
        await page.close();
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();

  console.table(failed);

  fs.mkdirSync("scripts/out", { recursive: true });
  fs.writeFileSync("scripts/out/failed-heroes.json", JSON.stringify(failed, null, 2));

  if (failed.length) {
    console.log(`\n❌ ${failed.length} heroes failed. See scripts/out/failed-heroes.json`);
    console.log(`📸 Screenshots saved in scripts/out/screenshots/\n`);
    process.exitCode = 1;
  } else {
    console.log("\n✅ All hero builds pages look good\n");
  }
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
