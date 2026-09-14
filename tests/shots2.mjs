import { chromium } from "@playwright/test";
const browser = await chromium.launch();
// desktop about re-check
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
await page.waitForTimeout(2400);
await page.evaluate(() => document.querySelector("#about")?.scrollIntoView());
await page.waitForTimeout(1400);
await page.screenshot({ path: "shots/desktop-4-about2.png" });
await page.close();
// mobile hero re-check
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto("http://localhost:4173", { waitUntil: "networkidle" });
await m.waitForTimeout(2600);
await m.screenshot({ path: "shots/mobile-0-top2.png" });
await m.close();
await browser.close();
console.log("done");
