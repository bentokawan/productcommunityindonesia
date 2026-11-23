# AGENTS — Panduan AI Coding Agent

Panduan lengkap untuk AI coding agent (Claude Code, Codex, Cursor, dsb.) di repo ini.
Ringkasan wajib-baca ada di [`/AGENTS.md`](../AGENTS.md); dokumen ini versi detailnya.

| Dokumen terkait | [PRD](PRD.md) · [design-web](design/design-web.md) · [design-admin](design/design-admin.md) · [ARCHITECTURE](ARCHITECTURE.md) · [plan/](plan/) |
|---|---|

---

## 1. Konteks Proyek

- **Apa:** website komunitas Product Community Indonesia, berupa landing page satu halaman + arsip webinar, plus CMS `/admin` (Fase CMS). Lihat [PRD §1](PRD.md#1-ringkasan-produk).
- **Stack:** Next.js App Router (TypeScript, RSC), Tailwind CSS v4, Supabase (Postgres + Auth + Storage), Vercel. Lihat [ARCHITECTURE](ARCHITECTURE.md).
- **Desain:** Figma `SHwk8txsKDV19XXgaBqiGk`, section `1:23`. Node per section tercantum di [design-web §4](design/design-web.md#4-urutan-section-landing). CMS `/admin` mengikuti pola admin Albana Speech Academy: [design/design-admin.md](design/design-admin.md).
- **Bahasa:** UI memakai Bahasa Indonesia santai ("kamu"). Kode, nama file, dan commit memakai Bahasa Inggris.
- **Fase:** MVP launch = P0 + CMS (F-16 – F-19, `PC`), lalu P1 → Phase 2 (F-13/F-14). Fase berikutnya tidak boleh dibangun tanpa diminta.
- **Eksekusi:** ikuti plan aktif di [`docs/plan/`](plan/) (file terbaru).

## 2. Sumber Kebenaran (urutan prioritas)

1. Instruksi user di sesi.
2. `/AGENTS.md` dan dokumen ini.
3. **PRD** menentukan *apa* yang dibangun (`F-xx`, copy final).
4. **design-web** (situs publik) dan **design-admin** (CMS) menentukan *tampilannya* (`C-xx`, token).
5. **ARCHITECTURE** menentukan *di mana & bagaimana* (`T-xx`, folder, kontrak).
6. **Figma** adalah referensi visual. Jika berbeda dari design-web, tanyakan user. Untuk CMS, referensinya kode & dokumen admin Albana yang dirujuk design-admin.

Jika dokumen saling bertentangan, **berhenti dan tanya** user. Jangan memilih sendiri.

## 3. Alur Kerja

1. **Pahami.** Baca `F-xx` terkait dan cek [PRD §7](PRD.md#7-matriks-keterlacakan).
2. **Rencanakan.** Untuk tugas > 1 file atau yang menyentuh DB, tulis plan di `docs/plan/YYYY-MM-DD-<nama-kebab>.md` (template §8) dan minta persetujuan.
3. **Implementasi.** Buat perubahan terkecil yang lengkap. Pakai komponen/query yang sudah ada.
4. **Verifikasi.** Jalankan `pnpm lint && pnpm typecheck && pnpm test`. Untuk UI, cek viewport 390, 768, dan 1440 lalu bandingkan dengan node Figma.
5. **Sinkronkan dokumen** (§6) dan centang checklist plan.
6. **Laporkan** apa yang diubah, apa yang belum diverifikasi, dan risikonya.

## 4. Coding Standards

### 4.1 TypeScript
- `strict`. Dilarang `any` dan `@ts-ignore` (pakai `@ts-expect-error` + alasan bila terpaksa).
- Tipe DB di-generate (`pnpm db:types`) dan tidak diedit manual.
- Input eksternal (search params, body webhook, form P2) divalidasi dengan **zod**.
- Pakai named export. Default export hanya untuk file konvensi Next.js.

### 4.2 React / Next.js
- Default ke Server Component. `"use client"` hanya untuk MobileMenu, HeroSlider, Tabs webinar, Accordion, pemanggil analytics, dan komponen interaktif CMS (C-28 – C-39, design-admin §11).
- Data diambil lewat `src/lib/queries/*` (publik, cached) atau `src/lib/queries/admin/*` (CMS, tanpa cache). Dilarang query Supabase dari komponen atau dari klien.
- Mutasi CMS hanya lewat Server Action di `features/admin/<modul>/actions.ts`: `requireStaff()`/`requireAdmin()` → zod → klien sesi user → `revalidateTag`. Pola: [ARCHITECTURE §9.5](ARCHITECTURE.md#95-pola-server-action).
- Kode situs publik (`app/(site)`, `features/home`, `features/webinar`) tidak boleh import klien cookie, `lib/auth`, atau `features/admin`, agar tetap statis.
- Gambar memakai `next/image` (`sizes` wajib bila `fill`). Font memakai `next/font` (DM Sans, DM Mono).
- Link eksternal memakai `Button external` atau `ExternalLink` (otomatis `target=_blank rel="noopener noreferrer"` + ikon ↗).
- Metadata dibuat lewat `lib/seo.ts`.

### 4.3 Styling
- Hanya Tailwind + token [design-web §2](design/design-web.md#2-design-tokens) (situs) atau `--admin-*` [design-admin §2](design/design-admin.md#2-token) (CMS). Token admin tidak dipakai di situs, dan sebaliknya. Dilarang hex/`rgb()`/px literal di komponen.
- Varian komponen memakai `cva`. Gabung kelas dengan `cn()`.
- Warna permukaan diatur lewat `<Section tone>`, tidak ditulis ulang di komponen.
- Pendekatan mobile-first: `base` = 390, `md` = 768, `lg` = 1024, `xl` = 1440.

### 4.4 Aksesibilitas
- Satu `h1` per halaman dan hierarki heading tidak boleh melompat.
- Focus ring terlihat ([design-web §3.4](design/design-web.md#34-state-wajib), [design-admin §7.1](design/design-admin.md#71-field)). Target sentuh ≥ 44px.
- Tabs, Accordion, MobileMenu, dan HeroSlider memakai pola WAI-ARIA.
- Emoji dekoratif `aria-hidden`. Gambar wajib punya `alt`. Hormati `prefers-reduced-motion`.

### 4.5 Database
- Skema hanya diubah lewat migrasi baru `supabase/migrations/<timestamp>_<domain>.sql`, satu domain per file ([ARCHITECTURE §3.2](ARCHITECTURE.md#32-database-supabase)). Migrasi yang sudah di-merge tidak boleh diedit.
- Setiap tabel baru wajib punya, di migrasi yang sama: constraint sesuai konvensi [ARCHITECTURE §4.1](ARCHITECTURE.md#41-konvensi), RLS aktif, policy per role ([§5.1](ARCHITECTURE.md#51-matriks-rls)), `updated_at` trigger, dan trigger audit (Fase CMS). Lalu: entri `T-xx`, webhook revalidasi, file seed `supabase/seeds/NN_<tabel>.sql`, dan pgTAP test.
- Otorisasi di-enforce RLS. Cek role di Next.js hanya untuk UX/redirect, bukan pengganti policy.
- Seed berisi copy dari Figma ([PRD §5](PRD.md#5-functional-requirements)). Jangan mengarang data.

## 5. Konvensi

| Hal | Konvensi | Contoh |
|-----|----------|--------|
| File & folder | kebab-case | `webinar-card.tsx` |
| Komponen | PascalCase | `WebinarCard` |
| Fungsi / variabel | camelCase | `getWebinarSection` |
| Konstanta | SCREAMING_SNAKE | `WEBINAR_PREVIEW_LIMIT` |
| Tabel/kolom DB | snake_case, tabel jamak | `team_members.linkedin_url` |
| Route & anchor | Bahasa Indonesia | `/webinar`, `#tentang`, `#kegiatan`, `#webinar`, `#pengurus`, `#faq` |
| Test | `*.test.ts` (unit), `*.spec.ts` (e2e) | `format-date.test.ts`, `join-community.spec.ts` |
| Branch | `<type>/<scope>` | `feat/hero-section` |
| Commit | Conventional Commits + ID | `feat(hero): add slider controls (F-02, C-12)` |
| Plan | `docs/plan/YYYY-MM-DD-<nama-kebab>.md` | `docs/plan/2026-11-23-mvp-cms-implementation.md` |

Komentar kode menjelaskan **mengapa**, bukan apa.

## 6. Sinkronisasi Dokumen

| Jika kamu… | Wajib perbarui |
|------------|----------------|
| Menambah/mengubah fitur | PRD §5 + PRD §7 |
| Menambah/mengubah komponen | design-web §3 atau design-admin §11 + PRD §7 |
| Mengubah token | design-web §2 + §7 (setelah Figma diubah) atau design-admin §2 + `globals.css` |
| Menambah/mengubah tabel | ARCHITECTURE §4, §5 + PRD §7 |
| Menambah query | ARCHITECTURE §7 |
| Menambah/mengubah modul CMS atau izin role | ARCHITECTURE §9.2, §9.3 + `nav.ts` + `permissions.ts` + RLS §5.1 + PRD F-17 – F-19 |
| Menambah env var | ARCHITECTURE §2.2 + `.env.example` + `lib/env.ts` |

ID tidak pernah dipakai ulang. Yang dihapus ditandai **(deprecated)**.

## 7. Guardrails

### 7.1 Perlu izin eksplisit user
- Membangun fitur Phase 2/3 atau fitur di luar PRD.
- Menambah dependency (jelaskan dulu alasannya dan alternatif tanpa dependency).
- Mengubah skema, RLS, atau menjalankan migrasi ke staging/production.
- Menyimpang dari Figma/design-web/design-admin atau mengubah token.
- Menghapus file/data/migrasi, `git push`, force push, deploy production.
- Memberi pengurus akses Supabase Studio/Dashboard. Konten hanya diubah lewat `/admin`.

### 7.2 Keamanan
- `service_role` hanya boleh ada di `lib/supabase/admin.ts` dengan `import "server-only"`, dan hanya di-import oleh `features/admin/users/actions.ts`.
- Jangan menyalakan signup publik Supabase Auth. Akun CMS hanya lewat undangan.
- Seed `90_local_dev_users.sql` hanya untuk lokal. Jangan pernah `supabase db push --include-seed`.
- Jangan commit `.env*` (kecuali `.env.example`) atau data pribadi asli.
- Jangan mematikan RLS atau menambah policy tulis untuk `anon`.
- `dangerouslySetInnerHTML` hanya boleh untuk JSON-LD yang dibangun dari objek di kode.

### 7.3 Kualitas
- Jangan klaim selesai sebelum lint, typecheck, dan test berjalan. Laporkan hasilnya apa adanya.
- Jangan membuat abstraksi atau opsi "untuk nanti".
- Copy UI harus persis sama dengan Figma/PRD. Jangan memparafrasekan.
- Nilai bertanda **(est.)** di design-web boleh dipakai, tapi verifikasi di Figma saat mengimplementasikan section terkait lalu perbarui design-web.

### 7.4 Saat ragu
Tanya user dengan pilihan konkret. Pemicunya antara lain: konflik dokumen, desain belum ada ([PRD §8](PRD.md#8-open-questions) Q-5), atau perubahan skema/API publik.

## 8. Template Plan

```markdown
# <Judul> — YYYY-MM-DD

## Tujuan
<1–2 kalimat. Rujuk F-xx.>

## Lingkup
- Termasuk: ...
- Tidak termasuk: ...

## Referensi
- PRD: F-xx · design-web/design-admin: C-xx · ARCHITECTURE: T-xx · Figma node: x:y

## Fase & checklist
### Fase N — <nama>
- [ ] ...
**Selesai bila:** ...

## Perubahan dokumen
- [ ] PRD / design-web / design-admin / ARCHITECTURE bagian ...

## Verifikasi
- [ ] pnpm lint && pnpm typecheck && pnpm test
- [ ] Viewport 390 / 768 / 1440 vs Figma, keyboard-only, axe 0 violation

## Risiko & pertanyaan terbuka
- ...
```

## 9. Perintah Standar

| Perintah | Fungsi |
|----------|--------|
| `pnpm dev` | Dev server |
| `pnpm lint` · `pnpm typecheck` | Kualitas statis |
| `pnpm test` · `pnpm test:e2e` | Vitest · Playwright |
| `pnpm db:start` · `pnpm db:reset` | Supabase lokal · reset + migrasi + seed |
| `pnpm db:types` | Generate `database.types.ts` |
| `pnpm db:test` | pgTAP: constraint & RLS (`supabase test db`) |

Script di atas adalah kontrak dan didefinisikan di `package.json` saat scaffolding (plan Fase 0).
