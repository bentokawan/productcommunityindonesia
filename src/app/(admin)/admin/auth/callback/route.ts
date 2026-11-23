import { NextResponse, type NextRequest } from "next/server";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const redirectTarget =
    next && next.startsWith("/admin") ? next : "/admin";

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth-callback`);
  }

  const supabase = await createServerAuthClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth-callback`);
  }

  return NextResponse.redirect(`${origin}${redirectTarget}`);
}
