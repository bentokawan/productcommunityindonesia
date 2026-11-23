import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";

const KNOWN_TABLES = [
  "site_settings",
  "site_stats",
  "hero_slides",
  "partners",
  "activities",
  "community_groups",
  "event_categories",
  "events",
  "team_members",
  "faqs",
] as const;

const revalidateBodySchema = z.object({
  table: z.enum(KNOWN_TABLES),
});

function isValidSecret(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const env = getServerEnv();
  const providedSecret = request.headers.get("x-revalidate-secret");

  if (!isValidSecret(providedSecret, env.REVALIDATE_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = revalidateBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid table", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  revalidateTag(parsed.data.table, "max");
  return NextResponse.json({ revalidated: parsed.data.table });
}
