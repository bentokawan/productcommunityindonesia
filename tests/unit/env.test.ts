import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getPublicEnv, getServerEnv } from "@/lib/env";

describe("env validation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("parses valid public env", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.NEXT_PUBLIC_SITE_URL = "https://pci.example.com";

    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://pci.example.com");
  });

  it("throws when REVALIDATE_SECRET is missing on server", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    delete process.env.REVALIDATE_SECRET;

    expect(() => getServerEnv()).toThrow();
  });
});
