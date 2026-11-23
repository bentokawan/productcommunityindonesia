import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function listFiles(dir: string, ext: string): string[] {
  const fullDir = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const full = path.join(fullDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(path.relative(process.cwd(), full), ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

describe("security and architecture boundaries", () => {
  it("imports lib/supabase/admin only inside features/admin/users/actions.ts", () => {
    const srcFiles = [
      ...listFiles("src", ".ts"),
      ...listFiles("src", ".tsx"),
    ];
    const importers = srcFiles.filter((file) => {
      const content = fs.readFileSync(file, "utf8");
      return content.includes("@/lib/supabase/admin");
    });

    expect(importers).toEqual([
      path.resolve(process.cwd(), "src/features/admin/users/actions.ts"),
    ]);
  });

  it("keeps public site routes and features free of CMS auth/admin imports", () => {
    const publicFiles = [
      ...listFiles("src/app/(site)", ".ts"),
      ...listFiles("src/app/(site)", ".tsx"),
      ...listFiles("src/features/home", ".ts"),
      ...listFiles("src/features/home", ".tsx"),
      ...listFiles("src/features/webinar", ".ts"),
      ...listFiles("src/features/webinar", ".tsx"),
    ];

    for (const file of publicFiles) {
      const content = fs.readFileSync(file, "utf8");
      expect(content).not.toMatch(/lib\/supabase\/(server-auth|admin)/);
      expect(content).not.toMatch(/lib\/auth/);
      expect(content).not.toMatch(/features\/admin/);
    }
  });

  it("has no anon write RLS policies in migrations", () => {
    const migrations = listFiles("supabase/migrations", ".sql");
    for (const file of migrations) {
      const content = fs.readFileSync(file, "utf8").toLowerCase();
      expect(content).not.toMatch(
        /for\s+(insert|update|delete|all)\s+to\s+anon/,
      );
    }
  });
});
