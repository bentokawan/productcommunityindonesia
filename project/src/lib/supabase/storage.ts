export function publicUrl(path: string): string {
  const trimmed = path.trim().replace(/^\/+/, "");
  if (trimmed.startsWith("placeholders/") || trimmed.startsWith("images/")) {
    return `/${trimmed}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!baseUrl) {
    return `/${trimmed}`;
  }
  return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/media/${trimmed}`;
}
