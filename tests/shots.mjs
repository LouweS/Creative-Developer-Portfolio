import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const shots = [];
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  const sections = ["#top", ".process", "#work", ".gallery", "#about", "#experiments", "#contact", ".footer"];
  for (let i = 0; i < sections.length; i++) {
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), sections[i]);
    await page.waitForTimeout(1400);
    const file = `shots/${name}-${i}-${sections[i].replace(/[#.]/g, "")}.png`;
    await page.screenshot({ path: file });
    shots.push(file);
  }
  // fullscreen menu
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "MENU" }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `shots/${name}-menu.png` });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "CLOSE" }).click();
  await page.waitForTimeout(400);
  // case study
  await page.evaluate(() => document.querySelector("#work")?.scrollIntoView());
  await page.waitForTimeout(900);
  const card = page.getByLabel(/Open case study: NOVA/);
  if (await card.isVisible()) {
    await card.click();
  } else {
    await page.evaluate(() => document.querySelector("#work")?.scrollIntoView());
    await page.getByLabel(/Open case study: NOVA/).click({ force: true });
  }
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `shots/${name}-case.png` });
  await page.keyboard.press("Escape");
  await page.close();
}
await browser.close();
console.log(shots.join("\n"));
