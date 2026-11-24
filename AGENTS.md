# AGENTS.md

Instruksi untuk semua AI coding agent di repo ini. Detail lengkap: [docs/AGENTS.md](docs/AGENTS.md).

## Proyek

Website Product Community Indonesia (PCI): landing page + arsip webinar + CMS `/admin` (wajib saat launch; pengurus tidak memakai Supabase Studio).
Stack: Next.js App Router (TypeScript) · Tailwind CSS v4 · Supabase · Vercel.
Desain: situs = Figma `SHwk8txsKDV19XXgaBqiGk` section `1:23`; CMS = pola admin Albana Speech Academy.

## Baca sebelum mengerjakan

1. [docs/PRD.md](docs/PRD.md) — fitur `F-xx`, copy final
2. [docs/design/design-web.md](docs/design/design-web.md) (situs) · [docs/design/design-admin.md](docs/design/design-admin.md) (CMS) — token & komponen `C-xx`
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — struktur, tabel `T-xx`, data flow
4. [docs/AGENTS.md](docs/AGENTS.md) — standar & guardrails
5. Plan aktif terbaru di [docs/plan/](docs/plan/)

## Plan

Setiap kali membuat plan (rencana implementasi), **simpan di `docs/plan/`** dengan format nama file:

```
docs/plan/YYYY-MM-DD-<nama-yang-relevan>.md
```

- `YYYY-MM-DD` = tanggal plan dibuat.
- `<nama-yang-relevan>` = kebab-case, singkat, menggambarkan isi (mis. `2026-11-24-hero-section.md`).
- Gunakan template di [docs/AGENTS.md §8](docs/AGENTS.md#8-template-plan).
- Jangan menimpa plan lama; buat file baru untuk revisi besar.

## Aturan inti

- Ikuti ID lintas dokumen: perubahan fitur/komponen/tabel wajib memperbarui PRD, design-web/design-admin, ARCHITECTURE sekaligus.
- Server Component default; data lewat `src/lib/queries`; mutasi lewat Server Actions.
- Styling hanya via token design system — tanpa hex/px literal di komponen.
- `SUPABASE_SERVICE_ROLE_KEY` hanya server-side (`lib/supabase/admin.ts`). RLS tidak boleh dimatikan; otorisasi CMS di-enforce RLS.
- Skema DB hanya berubah lewat migrasi baru di `supabase/migrations/` (satu domain per file).
- Copy UI Bahasa Indonesia santai ("kamu"); kode & commit Bahasa Inggris.
- Jalankan `pnpm --dir project lint && pnpm --dir project typecheck && pnpm --dir project test` (+ `pnpm --dir project db:test` bila menyentuh DB) sebelum mengklaim selesai.
- Aplikasi Next.js berada di `project/` (semua `src/`, `public/`, `tests/`, `package.json`), sedangkan `docs/` dan `supabase/` berada di root agar siap ditambah backend lain di masa depan.
- Ragu, dokumen bertentangan, atau desain belum ada → **tanya user**.
