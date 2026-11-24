import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/admin/login?error=invalid-link`);
  }

  const supabase = await createServerAuthClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=invalid-link`);
  }

  if (type === "recovery" || type === "invite") {
    return NextResponse.redirect(`${origin}/admin/reset-password`);
  }

  const redirectTarget =
    next && next.startsWith("/admin") ? next : "/admin";
  return NextResponse.redirect(`${origin}${redirectTarget}`);
}
