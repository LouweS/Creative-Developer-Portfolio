import { chromium } from "@playwright/test";

const browser = await chromium.launch();
for (const width of [320, 375, 390, 480, 768, 1024, 1280, 1440, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const clipped = (el) => {
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (["hidden", "clip", "auto", "scroll"].includes(s.overflowX)) return true;
        if (s.position === "fixed") return true;
      }
      return false;
    };
    const out = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > vw + 1 && !clipped(el)) {
        out.push(`${el.tagName}.${String(el.className).slice(0, 40)} R=${Math.round(r.right)}/${vw}`);
      }
    });
    return { sw: document.documentElement.scrollWidth, out: out.slice(0, 8) };
  });
  console.log(width, JSON.stringify(r));
  await page.close();
}
await browser.close();
