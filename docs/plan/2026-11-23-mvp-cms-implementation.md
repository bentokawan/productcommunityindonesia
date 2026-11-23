# MVP + CMS Implementation — 2026-11-23

> Plan tunggal MVP. CMS `/admin` selesai **sebelum launch** (pengurus tidak memakai Supabase Studio); desain CMS mengikuti [design-admin.md](../design/design-admin.md) (pola admin Albana Speech Academy).

## Tujuan
Meluncurkan situs PCI (F-01 – F-12, P0) yang identik dengan Figma `1:23` di 390 / 768 / 1440, **bersama** CMS `/admin` (F-16 – F-19) dengan role `admin`/`editor` sebagai satu-satunya cara pengurus mengubah konten. Lalu F-07 dan F-15 (P1). Semua di Next.js + Supabase + Vercel.

## Lingkup
- **Termasuk:** scaffolding; token & komponen situs (design-web C-01 – C-26 non-P2); skema T-01 – T-11, T-14, T-15 (migrasi modular + pgTAP); seed dari Figma; Supabase Auth (email+password, Google); RLS per role; kit UI CMS di-port dari Albana (design-admin C-28 – C-40); semua modul CMS (ARCHITECTURE §9.2); revalidasi; SEO; analitik; test; deploy.
- **Tidak termasuk:** F-13 registrasi, F-14 newsletter, halaman detail webinar (Phase 2); ekspor CSV, media library terpisah, draft/preview konten, signup publik; akses Supabase Studio untuk pengurus.

## Referensi
- PRD: F-01 – F-19, UF-1 – UF-5 · design-web: §2 token, §3 komponen, §4 urutan section · design-admin: §2 token, §3 kerangka, §5 templat, §11 komponen, §12 sampel CRUD · ARCHITECTURE: §3 folder (§3.2 SQL), §4 skema, §5 RLS, §6 flow, §7 queries, §9 CMS
- Figma: Desktop `1:24`, Tablet `1:288`, Mobile `1:550`, Menu `1:781`
- Kode referensi CMS: `albanaspeechacademy/front/components/admin/{shell,ui}/*`, `front/lib/admin-nav.ts`, blok `.admin-shell` di `front/app/globals.css`

## Urutan & dependensi

```
F0 Fondasi ─┬─ F1 Design system web ─┬─ F3 Layout shell ─ F4 Section statis ─ F5 Section dinamis ─ F6 SEO/Analitik ─┐
            └─ F2 Data layer ────────┴─ F7 CMS Auth & RBAC ─ F8 CMS kit & kerangka ─ F9 Modul konten ─ F10 Modul admin ┴─ F11 QA ─ F12 Launch
```

- Jalur situs (F1, F3 – F6) dan jalur CMS (F7 – F10) bisa paralel setelah F2.
- F4 – F5 boleh memakai data seed lokal. Konten final diisi pengurus lewat CMS di staging (F12).
- CMS ada di jalur kritis launch: situs tidak rilis sebelum F10 selesai.

---

## Fase 0 — Fondasi proyek
- [x] `git init`, `.gitignore` (Next.js + `.env*` kecuali `.env.example`), branch `main`
- [x] `pnpm create next-app` (TypeScript, App Router, `src/`, Tailwind v4, ESLint), tanpa contoh boilerplate. Catat versi Next (16 → `proxy.ts` & `updateTag`; 15 → `middleware.ts` & `revalidateTag`) di ARCHITECTURE *(Next.js `16.4.6` sudah terpasang di `project/` tanpa `src/` dan memakai `npm`/`package-lock.json`)*
- [ ] `tsconfig`: `strict`, `noUncheckedIndexedAccess`, alias `@/*`
- [ ] Prettier + `prettier-plugin-tailwindcss`. ESLint `typescript-eslint` strict
- [ ] Dependency: `@supabase/supabase-js`, `zod`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@vercel/analytics`, `@vercel/speed-insights`, `server-only`
- [ ] Dev dependency: `vitest`, `@playwright/test`, `@axe-core/playwright`, `supabase` (CLI)
- [ ] Script `package.json` sesuai [AGENTS §9](../AGENTS.md#9-perintah-standar) (termasuk `db:test`)
- [ ] `src/lib/env.ts` (zod) + `.env.example` (ARCHITECTURE §2.2)
- [ ] Struktur folder kosong sesuai ARCHITECTURE §3.1 dan §9.4
- [ ] GitHub Actions: lint → typecheck → test → build

**Selesai bila:** `pnpm lint && pnpm typecheck && pnpm test && pnpm build` hijau di CI.

## Fase 1 — Design system situs (design-web §2–3)
- [ ] `globals.css`: `@theme` + token semantik per `data-tone` (design-web §7)
- [ ] `layout.tsx` root: DM Sans (variable, `opsz`) + DM Mono via `next/font`, `lang="id"`
- [ ] Skala tipografi sebagai `@utility` (`text-display`, `text-h2`, …) responsif base/md/xl
- [ ] Export aset dari Figma: logo PCI (SVG, varian putih), ornamen lingkaran (SVG) ke `public/`
- [ ] `lib/utils.ts`: `cn()`, `formatEventDate()` (id-ID, Asia/Jakarta) + unit test
- [ ] Primitif: C-03 Logo, C-05 Button, C-06 Badge, C-07 SectionHeading, C-08 Card
- [ ] Layout: `Container`, `Section` (`tone`, `id`)
- [ ] Interaktif: C-19 Tabs (ARIA tablist), C-26 Accordion (multiple, default terbuka)
- [ ] Halaman dev `/_dev/ui` (dikecualikan dari build produksi)

**Selesai bila:** setiap varian cocok dengan node Figma, focus ring terlihat, axe 0 violation di `/_dev/ui`.

## Fase 2 — Data layer (ARCHITECTURE §3.2, §4–7)
- [ ] `supabase init`, `supabase start`. `config.toml`: `[db.seed] sql_paths = ["./seeds/*.sql"]`, `[auth] enable_signup = false`
- [ ] Migrasi per domain (tabel + constraint §4.1/§4.3 + index + trigger + RLS + policy SELECT `anon` §5.1):
  - [ ] `..._base.sql`: `pgcrypto` bila perlu, schema `private`, `private.set_updated_at()`, grant/revoke schema `private`
  - [ ] `..._site_settings_stats.sql`: T-01 (check key + URL), T-02
  - [ ] `..._hero_slides.sql`: T-03
  - [ ] `..._home_content.sql`: T-04, T-05, T-06
  - [ ] `..._events.sql`: T-08 lalu T-07 (FK restrict, slug check, Instagram check, index `(is_published, starts_at desc)`)
  - [ ] `..._team_faqs.sql`: T-10, T-11
  - [ ] `..._storage_media.sql`: bucket `media` public, `file_size_limit` 2 MB, MIME webp/png/jpeg
- [ ] Upload aset seed ke bucket (slide, poster, logo grup, foto pengurus dari Figma; path §4.5)
- [ ] Seed per tabel `supabase/seeds/01_…` – `10_…` (idempoten, copy PRD §5)
- [ ] pgTAP `01_schema_constraints.test.sql` (check, unique, FK restrict) dan `02_rls_anon.test.sql` (anon hanya SELECT, unpublished tidak terlihat, INSERT/UPDATE/DELETE ditolak)
- [ ] CI: `supabase db reset` + `supabase test db`
- [ ] `pnpm db:types` → `database.types.ts`
- [ ] `lib/supabase/server.ts` (anon, tanpa cookie) + `storage.ts#publicUrl`
- [ ] `lib/queries/*` (ARCHITECTURE §7.1): cache bertag + mapper + unit test mapper
- [ ] `getWebinarSection()`: maksimal 6 event + `next` (event mendatang terdekat atau `null`)
- [ ] `content/about.ts`, `content/fallback-links.ts`
- [ ] `app/api/revalidate/route.ts`: POST, secret timing-safe, zod `{ table }`, `revalidateTag`
- [ ] `next.config.ts`: `images.remotePatterns` host Supabase + header keamanan

**Selesai bila:** `pnpm db:reset` sukses dari nol, `pnpm db:test` hijau, query mengembalikan seed, `/api/revalidate` menolak request tanpa secret.

## Fase 3 — Layout shell situs
- [ ] `(site)/layout.tsx`: Analytics, SpeedInsights
- [ ] C-01 SiteNavbar, C-02 MobileMenu (focus trap, `Esc`, scroll-lock, kembalikan fokus), C-04 SiteFooter
- [ ] `(site)/page.tsx` dengan anchor `tentang`, `kegiatan`, `webinar`, `pengurus`, `faq`
- [ ] Smooth scroll CSS + guard reduced-motion + `scroll-margin-top`

**Selesai bila:** semua link navbar/menu/footer scroll ke section benar di 390/768/1440; menu bisa dioperasikan keyboard.

## Fase 4 — Section statis/sederhana
- [ ] F-04 Tentang (C-14), F-03 Kolaborasi (C-13), F-05 Kegiatan & Grup (C-17, C-18), F-08 Pengurus (C-24), F-09 CTA (C-25), F-10 FAQ (C-26)
- [ ] Bandingkan setiap section dengan Figma di 3 breakpoint; perbarui nilai (est.) di design-web

**Selesai bila:** screenshot Playwright tiap section cocok visual dengan Figma (review manual) dan copy persis PRD.

## Fase 5 — Section dinamis
- [ ] F-02 Hero (C-10, C-11) + C-12 HeroSlider (4 slide, caption per breakpoint, counter, prev/next md+, swipe, progress, ARIA carousel; autoplay menunggu PRD Q-7); slide pertama `priority`
- [ ] F-06 Webinar: C-19 Tabs, C-20 NextWebinarBanner (event vs fallback), C-21 WebinarCard; 3 kartu di base, 6 di md+; empty state per tab
- [ ] F-07 `/webinar` (P1): `?kategori=` server + C-22 Pagination 12/hal (PRD Q-5)

**Selesai bila:** slider dan tab bisa mouse/touch/keyboard, filter tab benar, banner berganti mode sesuai data.

## Fase 6 — SEO & Analitik
- [ ] `lib/seo.ts`, OG image, canonical dari `NEXT_PUBLIC_SITE_URL`
- [ ] JSON-LD `Organization` + `FAQPage`
- [ ] `sitemap.ts` (`/`, `/webinar`) + `robots.ts` (disallow `/admin`)
- [ ] `lib/analytics.ts#track`: `cta_click`, `webinar_tab`, `webinar_ig_click` di semua CTA

**Selesai bila:** Rich Results Test valid untuk FAQPage, event muncul di Vercel (preview).

## Fase 7 — CMS: Auth & RBAC (F-16 · ARCHITECTURE §4.4, §5, §6.3, §9.1)
Prasyarat: persetujuan dependency `@supabase/ssr`, `radix-ui`, `sonner` (design-admin §14); PRD Q-9 (admin pertama, pemilik Google Cloud).
- [ ] Migrasi `..._auth_roles_profiles.sql`: enum `app_role`, T-14 + RLS, `private.current_app_role()`, `is_staff()`, `is_admin()`, `guard_last_admin()`
- [ ] `config.toml`: `[auth.external.google]` (env CLI), `site_url`, `additional_redirect_urls` (`/admin/auth/callback`, `/admin/auth/confirm`), password min 10
- [ ] Google Cloud OAuth client per environment, redirect ke callback Supabase; Supabase Dashboard staging/prod: Google aktif, signup off
- [ ] `lib/supabase/server-auth.ts`, `src/proxy.ts` (refresh sesi, guard `/admin/*` kecuali login/lupa/reset/`auth/*`)
- [ ] `lib/auth/session.ts` (`getStaff` di-cache per request, `requireStaff`, `requireAdmin`) + `lib/auth/permissions.ts` (`can()`, ARCHITECTURE §9.3) + unit test
- [ ] `(admin)/admin/layout.tsx`: Plus Jakarta Sans `--font-admin`, `.admin-shell`, noindex, `<Toaster/>`
- [ ] Halaman `(auth)/login` (email+password + "Masuk dengan Google"), `forgot-password`, `reset-password` dengan gaya design-admin (kartu 32, input pil, tombol hitam)
- [ ] Route `auth/callback`, `auth/confirm`, `auth/signout`
- [ ] `features/admin/auth`: `login-form.tsx`, `google-button.tsx`, `actions.ts`, `schema.ts` (pesan error santai, tidak membocorkan apakah email terdaftar)
- [ ] User tanpa `profiles` aktif → sign out + "Akun kamu belum punya akses CMS"
- [ ] Seed `90_local_dev_users.sql` (lokal saja)
- [ ] Header `Cache-Control: private, no-store` untuk `/admin/*`
- [ ] Cek output build: `/` dan `/webinar` tetap statis
- [ ] pgTAP: RLS `profiles` + guard admin terakhir

**Selesai bila:** login email+password dan Google jalan di lokal & staging, email tak diundang ditolak, `/admin` tanpa sesi redirect ke login, `/` tetap statis.

## Fase 8 — CMS: kit UI & kerangka (design-admin §2–§11)
Port dari Albana, sesuaikan nama file (kebab-case), role (`admin`/`editor`), dan hapus bagian yang tidak dipakai (Ekspor, Rupiah, telepon, lencana tagihan).
- [ ] Token `.admin-shell` + `@theme inline` `--color-admin-*` (terang & gelap) di `globals.css` (design-admin §2.5); CSS `.admin-table` dari referensi
- [ ] Primitif shadcn ke `components/ui/`: dialog, select, checkbox, label, dropdown-menu, tooltip; `sonner`
- [ ] C-28 AdminShell (header 72: logo, tema, menu akun), C-29 AdminSidebar (grup + pil, ringkas 1024–1279, laci < 1024), `nav.ts` (`NAV_GROUPS` + `roles`), C-40 PageHeader
- [ ] C-30 DataTable + StatusChip, C-34 TableToolbar (tanpa Ekspor), C-39 RowActions, C-33 DeleteDialog, C-38 EmptyState, skeleton
- [ ] C-35 AdminSheet + FormDialog (sm/md/lg, lembar bawah < 640), C-36 Field/FieldGrid/FormSection/FormPage, C-37 AdminInput/Textarea/Select/CheckboxCard
- [ ] C-31 SortButtons, C-32 ImageUpload
- [ ] `features/admin/ui/action-result.ts` (`ActionResult`, `fail`, `fromZod`, peta kode Postgres 23505/23503/23514/42501 → pesan Indonesia), `storage.ts` (`uploadImage`, `removeImage`), `sort.ts` (`nextSortOrder`)
- [ ] `next.config.ts`: `serverActions.bodySizeLimit = "3mb"`
- [ ] Migrasi `..._cms_write_policies.sql`: policy tulis T-01 – T-11 per ARCHITECTURE §5.1 (editor vs admin)
- [ ] Migrasi `..._storage_media_write.sql`: insert/update/delete `storage.objects` bucket `media` untuk staff, folder dibatasi `hero|events|groups|team`
- [ ] Migrasi `..._audit_logs.sql`: T-15 + `private.log_change()` di T-01 – T-11, T-14
- [ ] pgTAP `03_rls_editor`, `04_rls_admin`, `05_storage_policies` (editor tidak bisa tulis T-01/T-08/T-14, tidak bisa baca T-15)
- [ ] `(cms)/layout.tsx` + Dashboard T4 (sorotan webinar berikutnya, metrik, "Perlu dilengkapi", 10 log terakhir untuk admin)
- [ ] Tema gelap: toggle header, `localStorage` `pci-admin-theme`
- [ ] `/_dev/ui` ditambah varian komponen CMS

**Selesai bila:** sidebar sesuai role, pgTAP role hijau, Dashboard lolos daftar periksa design-admin §13 dan axe 0 violation.

## Fase 9 — CMS: modul konten (F-17 · design-admin §5.1, §12)
Pola per modul: `lib/queries/admin/<modul>.ts` → `<modul>-manager.tsx` (atau `-form.tsx` untuk T2) → `schema.ts` (zod = constraint DB) → `actions.ts` (save/remove/move/toggle + revalidate) → `loading.tsx` → unit test schema → e2e tambah/ubah/hapus.
- [ ] **FAQ** — sampel A (tabel + dialog `md`); jadikan acuan modul lain
- [ ] **Kegiatan** (emoji ≤ 8), **Kolaborasi**, **Hero · Statistik** (maks 4) — pola A
- [ ] **Pengurus** — sampel B (grid kartu + dialog `lg` + unggah foto)
- [ ] **Grup Komunitas** (unggah logo), **Hero · Slide** (alt wajib, caption pendek/panjang) — pola B; `/admin/hero` dengan pil segmen Slide · Statistik
- [ ] **Semua Webinar** — T1 tabel + saring kategori/status/waktu + T2 `/new` & `/[id]` (2 bagian: Info webinar · Poster & tautan), poster 1:1, slug otomatis dari judul, `starts_at` WIB, URL Instagram
- [ ] **Kategori** (admin) — pola A; pesan jelas saat hapus ditolak FK
- [ ] Ganti/hapus gambar membersihkan objek storage lama
- [ ] Setiap simpan memanggil revalidate; cek `/` ter-update
- [ ] Copy UI CMS santai; label tombol konsisten ("Simpan", "Batal", "Hapus", "Tambah")

**Selesai bila:** editor bisa CRUD semua konten beranda & webinar dari `/admin`, perubahan tampil di `/` ≤ 60 detik, e2e per modul hijau.

## Fase 10 — CMS: modul admin (F-18, F-19)
- [ ] **Link & Sosial Media** — sampel C (T2 ringkas, upsert 4 key, validasi `https://`)
- [ ] **Pengguna** — `lib/supabase/admin.ts` (`server-only`); undang (`inviteUserByEmail` + insert `profiles`), ubah role, aktif/nonaktif, hapus; error guard admin terakhir jelas
- [ ] **Log Aktivitas** — tabel read-only + saring modul/pengguna + panel samping T3 berisi diff
- [ ] **Akun Saya** — nama, password, hubungkan Google (`linkIdentity`)
- [ ] e2e matriks role: editor tidak melihat menu admin, route admin-only → 404

**Selesai bila:** admin bisa mengundang user baru, mengubah link situs, dan melihat log perubahan.

## Fase 11 — QA (situs + CMS)
- [ ] Playwright e2e UF-1 – UF-3 (situs) di 390 & 1440, UF-4 – UF-5 (CMS) di 390 & 1280
- [ ] `@axe-core/playwright`: 0 violation di `/`, `/webinar`, dan semua halaman `/admin`
- [ ] Keyboard-only penuh; VoiceOver iOS / TalkBack untuk menu, slider, accordion, sidebar laci, dialog, unggah
- [ ] Tanpa scroll horizontal di 360 (situs & CMS)
- [ ] Lighthouse mobile situs ≥ 90; LCP ≤ 2.5s, CLS ≤ 0.1; bundle `/` tidak memuat kode `features/admin`
- [ ] Uji revalidasi: ubah FAQ di CMS staging → tampil di `/` ≤ 60 detik
- [ ] Security review: import `admin.ts` hanya di modul Pengguna, CSP `connect-src` Supabase, signup off, redirect URL per env, tidak ada policy tulis `anon`

**Selesai bila:** semua checklist hijau; hasil Lighthouse + axe dilampirkan di PR.

## Fase 12 — Deploy & Launch
- [ ] Supabase staging + production: migrasi, bucket, seed `01`–`10` manual (tanpa `90_local_dev_users`)
- [ ] Database Webhooks T-01 – T-11 → `/api/revalidate` (jaring pengaman perubahan di luar CMS)
- [ ] Vercel: env per environment, preview per PR, production dari `main`
- [ ] Bootstrap admin pertama (PRD Q-9): `inviteUserByEmail` + insert `profiles` role `admin`, sekali, manual
- [ ] Admin mengundang pengurus (editor); pengurus mengisi konten final di staging lalu production lewat `/admin`
- [ ] Pastikan tidak ada pengurus di Supabase Dashboard (hanya engineer)
- [ ] Domain produksi + HTTPS (PRD Q-6)
- [ ] Smoke test produksi: semua CTA, anchor, gambar, login CMS, satu edit konten
- [ ] Panduan singkat pengurus: login, ubah konten, unggah gambar di `/admin`

**Selesai bila:** situs live di domain produksi dan pengurus (editor) mengubah satu konten lewat `/admin` tanpa bantuan engineer.

---

## Perubahan dokumen
- [ ] design-web: ganti nilai (est.) tablet/mobile dengan nilai terverifikasi (Fase 4–5)
- [ ] design-admin: catat penyimpangan dari kit Albana saat port (Fase 8)
- [ ] PRD §8: tutup Q-1 – Q-7, Q-9 setelah dijawab
- [ ] ARCHITECTURE: catat versi Next.js (Fase 0) dan deviasi implementasi

## Verifikasi (setiap PR)
- [ ] `pnpm lint && pnpm typecheck && pnpm test` (+ `pnpm db:test` bila menyentuh `supabase/`)
- [ ] Situs: 390 / 768 / 1440 vs Figma. CMS: 360 / 768 / 1280 vs design-admin §13. Keyboard-only, axe 0 violation

## Risiko & pertanyaan terbuka
- **CMS di jalur kritis launch.** Bila CMS terlambat, situs ikut tertunda. Mitigasi: jalur CMS dimulai segera setelah F2, paralel dengan jalur situs.
- **Port kit Albana** membawa dependency `radix-ui` + `sonner` dan kode shadcn. Perlu persetujuan; bundle situs publik dijaga dengan aturan import (ARCHITECTURE §3.1).
- **Aset Figma** (foto slide, logo grup, foto pengurus, poster) harus di-export resolusi asli; URL MCP kedaluwarsa 7 hari (PRD Q-2).
- **Link final** WA/IG/LinkedIn dan URL post IG belum ada (PRD Q-1, Q-3). Bisa diisi admin lewat CMS sebelum launch.
- **Google OAuth + signup off:** pastikan login Google pertama untuk user undangan ter-link ke akun yang ada. Uji di staging; fallback: set password dulu lalu hubungkan Google di Akun Saya.
- **Klien cookie bocor ke halaman publik** membuat `/` dinamis. Dijaga aturan import + cek output build.
- **Autoplay slider** (PRD Q-7) dan **`/webinar` tanpa desain** (PRD Q-5) belum diputuskan.
