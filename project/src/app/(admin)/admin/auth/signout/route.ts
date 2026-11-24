import { NextResponse, type NextRequest } from "next/server";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

export async function POST(request: NextRequest) {
  const supabase = await createServerAuthClient();
  await supabase.auth.signOut();
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/admin/login`, { status: 303 });
}
