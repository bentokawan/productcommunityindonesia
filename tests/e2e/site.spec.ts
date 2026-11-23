import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Public site UF-1 – UF-3 & accessibility", () => {
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
    await expect(
      page.getByRole("dialog", { name: "Menu navigasi" }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: "Menu navigasi" }),
    ).toBeHidden();
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
