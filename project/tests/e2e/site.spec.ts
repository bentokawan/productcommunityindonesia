import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Public site UF-1 – UF-3 & accessibility", () => {
  test("Hero fits desktop and laptop viewports without bottom clipping and controls work", async ({
    page,
  }) => {
    for (const vp of [
      { width: 1440, height: 900 },
      { width: 1366, height: 768 },
    ]) {
      await page.setViewportSize(vp);
      await page.goto("/");

      await expect(
        page.getByRole("heading", { level: 1 }),
      ).toContainText("Belajar & Bertumbuh Bersama");

      const heroRegion = page.locator("#top");
      const checks = [
        heroRegion.getByRole("link", { name: /Gabung Grup WhatsApp/i }),
        heroRegion.getByText("8+", { exact: true }),
        heroRegion.getByText("1000+", { exact: true }),
        heroRegion.getByRole("button", { name: "Slide berikutnya" }),
        heroRegion.getByRole("button", { name: /Slide 4:/i }),
      ];

      for (const loc of checks) {
        await expect(loc).toBeVisible();
        const box = await loc.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height);
      }
    }

    // Slider next and WCAG 2.2.2 Pause/Play toggle (A-19: aria-live off while autoplaying, polite when paused)
    const counter = page.locator("#top [aria-live]");
    await expect(counter).toHaveAttribute("aria-live", "off");
    await expect(counter).toHaveText("01 / 04");
    await page.getByRole("button", { name: "Slide berikutnya" }).click();
    await expect(counter).toHaveText("02 / 04");

    const pauseBtn = page.getByRole("button", { name: "Jeda slide otomatis" });
    await pauseBtn.click();
    await expect(
      page.getByRole("button", { name: "Putar otomatis slide" }),
    ).toBeVisible();
    await expect(counter).toHaveAttribute("aria-live", "polite");

    // Verify A-01 computed typography on Button (18px / 700 at 1440/1366) & Badge caption (12px DM Mono)
    const heroBtnStyle = await page
      .locator("#top section")
      .getByRole("link", { name: /Gabung Grup WhatsApp/i })
      .evaluate((el) => {
        const s = getComputedStyle(el);
        return { fontSize: s.fontSize, fontWeight: s.fontWeight };
      });
    expect(heroBtnStyle).toEqual({ fontSize: "18px", fontWeight: "700" });

    // Verify A-18 skip link exists and targets #konten
    const skipLink = page.getByRole("link", { name: "Lewati ke konten utama" });
    await expect(skipLink).toHaveAttribute("href", "#konten");
    await expect(page.locator("main#konten")).toBeVisible();

    // Verify A-20 Accordion closed panel sets inert
    const firstFaqBtn = page.locator("#faq button[aria-expanded]").first();
    await expect(firstFaqBtn).toHaveAttribute("aria-expanded", "true");
    const panelId = await firstFaqBtn.getAttribute("aria-controls");
    await firstFaqBtn.click();
    await expect(firstFaqBtn).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(`#${panelId}`)).toHaveAttribute("inert", "");
  });

  test("UF-1 & UF-2: landing page sections, WhatsApp CTA, and webinar tabs at 1440px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText("Belajar & Bertumbuh Bersama");

    const heroWa = page
      .locator("section")
      .first()
      .getByRole("link", { name: /Gabung Grup WhatsApp/i });
    await expect(heroWa).toHaveAttribute("target", "_blank");
    await expect(heroWa).toHaveAttribute("href", /^https:\/\//);

    // About section mission progress matches 5 missions (01 / 05, not 06)
    const aboutRegion = page.locator("#tentang");
    await expect(aboutRegion.getByText("MISI 01 DARI 05")).toBeVisible();
    await expect(aboutRegion.getByText("01 / 05")).toBeVisible();
    await expect(
      aboutRegion.getByRole("button", { name: /^Lihat Misi \d+$/ }),
    ).toHaveCount(5);
    await aboutRegion.getByRole("button", { name: "Lihat Misi 2" }).click();
    await expect(aboutRegion.getByText("MISI 02 DARI 05")).toBeVisible();
    await expect(aboutRegion.getByText("02 / 05")).toBeVisible();

    // Tabs filter (UF-2)
    const riungTab = page.getByRole("tab", { name: "Riung Class" });
    await riungTab.click();
    await expect(riungTab).toHaveAttribute("aria-selected", "true");
    await expect(
      page.getByRole("heading", { name: "Building a Product with Purpose" }),
    ).toBeVisible();

    const allTab = page.getByRole("tab", { name: "Semua" });
    await allTab.click();
    await expect(allTab).toHaveAttribute("aria-selected", "true");

    // Accessibility audit on /
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });

  test("UF-3: mobile menu opens, traps/closes on Escape, and no horizontal overflow at 360px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);

    const openBtn = page.getByRole("button", { name: "Buka menu navigasi" });
    await openBtn.click();
    const dialog = page.getByRole("dialog", { name: "Menu navigasi" });
    await expect(dialog).toBeVisible();

    // Ensure mobile menu renders solidly on top of all page content (no hero/partner bleed-through)
    const menuCheck = await page.evaluate(() => {
      const el = document.getElementById("mobile-nav-menu");
      if (!el) return null;
      const bg = getComputedStyle(el).backgroundColor;
      const hitBottom = document.elementFromPoint(180, 680);
      const hitMid = document.elementFromPoint(180, 420);
      return {
        bg,
        coversBottom: Boolean(hitBottom && el.contains(hitBottom)),
        coversMid: Boolean(hitMid && el.contains(hitMid)),
      };
    });
    expect(menuCheck).toEqual({
      bg: "rgb(26, 26, 25)",
      coversBottom: true,
      coversMid: true,
    });

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(openBtn).toBeFocused();
  });

  test("/webinar archive passes axe and has no horizontal overflow at 360px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/webinar");

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);

    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
});

test.describe("CMS auth guard, /admin/login accessibility & API security", () => {
  test("redirects unauthenticated /admin to /admin/login and passes axe", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasOverflow).toBe(false);

    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });

  test("rejects /api/revalidate without valid secret", async ({ request }) => {
    const res = await request.post("/api/revalidate", {
      data: { table: "faqs" },
    });
    expect(res.status()).toBe(401);
  });
});
