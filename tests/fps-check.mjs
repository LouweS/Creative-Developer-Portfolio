import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:4173", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
// scroll through the whole page to exercise every animated section, sampling real frame deltas
const result = await page.evaluate(async () => {
  const deltas = [];
  let last = performance.now(), stop = false;
  const loop = (now) => { deltas.push(now - last); last = now; if (!stop) requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  const h = document.body.scrollHeight - innerHeight;
  for (let y = 0; y <= h; y += 220) { scrollTo(0, y); await new Promise(r => setTimeout(r, 16)); }
  await new Promise(r => setTimeout(r, 1500));
  stop = true;
  const ds = deltas.slice(2); // drop startup outliers
  const avg = ds.reduce((a, b) => a + b, 0) / ds.length;
  return {
    frames: ds.length,
    avgFps: Math.round(1000 / avg),
    minFps: Math.round(1000 / Math.max(...ds)),
    avgFrameMs: +avg.toFixed(1),
  };
});
console.log(JSON.stringify(result));
const pass = result.avgFps >= 60 && result.minFps >= 50;
console.log(`STATUS: ${result.avgFps >= 70 ? "EXCELLENT" : pass ? "PASS" : "CHECK"}`);
await browser.close();
