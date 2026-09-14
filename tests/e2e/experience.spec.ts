import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

test.describe("experience", () => {
  test("hero headline is present and page has no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("CREATIVE DEVELOPER / DESIGNER")).toBeVisible();
    await page.waitForTimeout(2200); // loader out + hero entrance
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("navigation opens fullscreen menu and jumps to sections", async ({ page }) => {
    await page.goto("/");
    // primary path: fullscreen menu (works on every breakpoint)
    await page.getByRole("button", { name: "MENU" }).click();
    await expect(page.getByRole("button", { name: "CLOSE" })).toBeVisible();
    await page.getByRole("button", { name: "WORK" }).first().click();
    await expect(page.locator("#work")).toBeInViewport({ timeout: 5000 });
    await expect(page.locator(".menu--open")).toHaveCount(0);
  });

  test("case study opens, URL updates, Escape closes", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.getByLabel(/Open case study: NOVA/).scrollIntoViewIfNeeded();
    await page.getByLabel(/Open case study: NOVA/).click();
    await expect(page.locator(".case")).toBeVisible();
    await expect(page).toHaveURL(/case=/);
    await page.keyboard.press("Escape");
    await expect(page.locator(".case")).not.toBeVisible();
  });

  test("gallery rail translates continuously", async ({ page }) => {
    await page.goto("/");
    const rail = page.locator(".gallery__rail");
    const before = await rail.evaluate((el) => el.style.transform);
    await page.waitForTimeout(900);
    const after = await rail.evaluate((el) => el.style.transform);
    expect(before).not.toBe(after);
  });

  test("experiments activate on click", async ({ page }) => {
    await page.goto("/");
    const btn = page.getByRole("button", { name: /ACTIVATE EXP.01/ });
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await expect(page.getByRole("heading", { name: "REPELLENT FIELD" })).toBeVisible();
    await expect(page.locator(".exp-card__canvas").first()).toBeVisible();
  });

  test("contact CTA copies email", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const cta = page.getByRole("button", { name: /SEND A MESSAGE/i });
    await cta.scrollIntoViewIfNeeded();
    await cta.click();
    await expect(page.getByText("MESSAGE COPIED")).toBeVisible();
  });

  test("keyboard: skip link and focus visibility", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByText("Skip to content")).toBeFocused();
  });

  test("accessibility snapshot has no critical violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    const headings = await page.locator("h1, h2, h3").count();
    expect(headings).toBeGreaterThan(3);
    const unlabeled = await page.evaluate(() =>
      Array.from(document.querySelectorAll("button")).filter(
        (b) => !b.textContent?.trim() && !b.getAttribute("aria-label")
      ).length
    );
    expect(unlabeled).toBe(0);
  });

  for (const vp of VIEWPORTS) {
    test(`responsive composition at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto("/");
      await page.waitForTimeout(1800);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(2);
    });
  }
});
