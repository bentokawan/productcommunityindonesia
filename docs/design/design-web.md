# design-web — Design System Situs Publik

| Atribut | Nilai |
|---------|-------|
| Status | v0.4 — 2026-11-23 (dipisah: situs publik saja; CMS di design-admin.md) |
| Sumber | Figma `SHwk8txsKDV19XXgaBqiGk`, section `1:23` (Desktop `1:24`, Tablet `1:288`, Mobile `1:550`, Menu `1:781`) |
| Implementasi | Tailwind CSS v4 (`@theme` di `src/app/globals.css`) + `src/components/ui` |
| Dokumen terkait | [PRD](../PRD.md) · [design-admin](design-admin.md) · [ARCHITECTURE](../ARCHITECTURE.md) · [AGENTS](../AGENTS.md) |

> **Asal nilai.**
> - Nilai desktop diambil langsung dari kode Figma (`get_design_context` node `1:24`).
> - File Figma **tidak memakai Variables/Styles**, jadi token di bawah adalah hasil normalisasi dari nilai literal.
> - Nilai tablet/mobile bertanda **(est.)** dihitung dari dimensi frame. Verifikasi di Figma Inspect saat mengimplementasikan.

---

## 1. Prinsip Visual

1. **Ritme gelap/terang.** Urutannya Hero + Kolaborasi (gelap), Tentang (putih), Kegiatan (krem), Webinar (gelap), Pengurus (putih), CTA (kartu brand), FAQ (putih), Footer (gelap). Jangan tambah warna permukaan lain.
2. **Brand mint = aksi & penekanan.** `brand-500` dipakai untuk CTA primary, tab aktif, frasa highlight di permukaan gelap, dan kartu CTA. Di permukaan terang, penekanan teks memakai `brand-700`.
3. **Ramah & manusiawi.** Ikon berupa emoji, sudut membulat besar (20–32px), tombol pill, dan copy santai.
4. **Konten nyata.** Foto kegiatan, poster webinar, dan foto pengurus tampil tanpa overlay.

---

## 2. Design Tokens

### 2.1 Warna — primitif (dari Figma)

| Token | Hex | Sumber pemakaian di Figma |
|-------|-----|---------------------------|
| `ink-900` | `#1A1A19` | Latar Hero/Webinar/Footer, kartu Visi, teks utama di permukaan terang, teks di atas tombol brand |
| `ink-800` | `#262624` | Kartu webinar & banner "Webinar berikutnya" |
| `stone-500` | `#6B6B66` | Teks sekunder di permukaan terang |
| `stone-300` | `#B3B3AE` | Teks sekunder di permukaan gelap |
| `stone-200` | `#E7E7E3` | Border kartu grup (permukaan terang) |
| `stone-100` | `#F4F4F1` | Latar section Kegiatan, item FAQ |
| `white` | `#FFFFFF` | Latar Tentang/Pengurus/FAQ, kartu kegiatan, teks di permukaan gelap |
| `brand-500` | `#02D6A6` | Tombol primary, tab aktif, highlight H1, eyebrow di permukaan gelap, kartu CTA |
| `brand-700` | `#017057` | Eyebrow, highlight heading, nomor misi, link "LinkedIn ↗" di permukaan terang |
| `brand-50` | `#E3F8F2` | Latar kotak ikon kegiatan |

Alpha yang dipakai Figma (jadikan token, jangan ditulis literal):

| Token | Nilai | Pemakaian |
|-------|-------|-----------|
| `white/8` | `rgb(255 255 255 / 0.08)` | Border kartu webinar |
| `white/10` | `/0.10` | Divider (Kolaborasi, kartu webinar) |
| `white/12` | `/0.12` | Border hero slider |
| `white/15` | `/0.15` | Pemisah vertikal stats |
| `white/22` | `/0.22` | Border tagline pill, tab non-aktif |
| `white/35` | `/0.35` | Border tombol outline di permukaan gelap |
| `white/55` | `/0.55` | Nama partner |
| `white/80` | `/0.80` | Link navbar |
| `white/90` | `/0.90` | Teks tagline pill |
| `brand/14` | `rgb(2 214 166 / 0.14)` | Latar chip edisi webinar |
| `brand/15` | `/0.15` | Latar chip "WEBINAR BERIKUTNYA" |
| `brand/50` | `/0.50` | Border banner "Webinar berikutnya" |

### 2.2 Warna — semantik

Komponen **hanya** memakai token semantik. `Section tone` menukar nilainya.

| Token | `light` / `muted` | `dark` |
|-------|-------------------|--------|
| `--color-bg` | `white` / `stone-100` | `ink-900` |
| `--color-surface` (kartu) | `white` | `ink-800` |
| `--color-fg` | `ink-900` | `white` |
| `--color-fg-muted` | `stone-500` | `stone-300` |
| `--color-border` | `stone-200` | `white/8` |
| `--color-divider` | `stone-200` | `white/10` |
| `--color-accent` (teks penekanan) | `brand-700` | `brand-500` |
| `--color-primary` (fill tombol/tab aktif) | `brand-500` | `brand-500` |
| `--color-on-primary` | `ink-900` | `ink-900` |
| `--color-outline` (border tombol outline) | `ink-900` | `white/35` |
| `--color-focus` | `brand-700` | `brand-500` |

Kontras (WCAG 2.2 AA): `brand-700`/white, `stone-500`/`stone-100`, `stone-300`/`ink-800`, `ink-900`/`brand-500`, dan `brand-500`/`ink-900` semuanya ≥ 4.5:1. **Jangan** pakai `brand-500` sebagai warna teks di latar putih.

### 2.3 Tipografi

| Token | Nilai |
|-------|-------|
| `--font-sans` | **DM Sans** (variable, `opsz` 14), weight 400/500/600/700, via `next/font/google` |
| `--font-mono` | **DM Mono** 400, untuk caption slider dan counter |

| Token | Desktop (Figma) | Tablet (est.) | Mobile (est.) | Weight | LH | Tracking | Pemakaian |
|-------|-----------------|---------------|---------------|--------|----|----------|-----------|
| `display` | 64px | 52px | 38px | 700 | 1.08 | -0.025em (-1.6px) | H1 hero |
| `h2` | 44px | 36px | 28px | 700 | 1.12 | -0.02em (-0.88px) | Judul section |
| `h3` | 36px | 32px | 26px | 700 | 1.15 | -0.02em | Heading CTA Gabung |
| `h4` | 28px | 26px | 22px | 700 | 1.25 | 0 | "Grup di dalam komunitas", judul banner webinar |
| `title` | 22px | 22px | 20px | 700 | 1.25 | 0 | Judul kartu kegiatan/webinar, nama pengurus |
| `quote` | 22px | 20px | 18px | 500 | 1.5 | 0 | Teks Visi |
| `stat` | 36px | 34px | 28px | 700 | 1 | 0 | "8+", "1000+" |
| `lead` | 20px | 18px | 16px | 400 | 1.5–1.55 | 0 | Sub hero, intro section |
| `faq-q` | 20px | 18px | 17px | 700 | 1.3 | 0 | Pertanyaan FAQ |
| `button` | 18px | 17px | 16px | 700 | 1 | 0 | Tombol |
| `nav` | 18px | — | 26px (menu) | 500 / 700 | 1 | 0 | Link navbar / link menu mobile |
| `body` | 18px | 17px | 16px | 400 | 1.5 | 0 | Butir misi |
| `body-sm` | 17px | 16px | 15px | 400 | 1.55 | 0 | Jawaban FAQ, tagline pill (600) |
| `meta` | 15px | 15px | 14px | 400 / 500 | 1.4 | 0 | Pembicara, tanggal, label stat (500), link kartu (700) |
| `small` | 14px | 14px | 14px | 400 | 1.4 | 0 | Deskripsi grup, copyright |
| `eyebrow` | 16px | 15px | 13px | 700 | 1 | 0.14em (2.24px), UPPERCASE | Label section |
| `chip` | 13px | 13px | 12px | 700 | 1 | 0 (edisi) / 0.12em (status) | Chip edisi, "WEBINAR BERIKUTNYA" |
| `mono` | 12px / 11px | — | — | 400 (DM Mono) | 1 | 0.04em | Counter "01 / 04" / caption slide |

Highlight di heading: bungkus frasa dengan `<em>` bergaya `not-italic text-(--color-accent)`.

### 2.4 Layout & Spacing (basis 4px)

| Token | Desktop 1440 | Tablet 768 | Mobile 390 |
|-------|--------------|------------|------------|
| `--container` (lebar konten) | 1200px | 688px | 350px |
| `--gutter` | 120px | 40px | 20px |
| `--section-y` (padding atas/bawah) | 120px | 96px (est.) | 72px (est.) |
| `--grid-gap` | 24px | 24px | 12px |
| Heading section → konten | 48px | 40px (est.) | 32px (est.) |
| Eyebrow → H2 | 12px | 12px | 8px |
| H2 → lead | 16px | 16px | 12px |
| Navbar | tinggi 72, offset atas 24 | sama | sama |

Implementasi: `max-w-[1200px] px-5 md:px-10 xl:px-0 mx-auto`. Pada lebar 1024–1279 gunakan `px-10`.

Grid per section:

| Section | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Hero | 2 kolom (600 + 540) | 1 kolom | 1 kolom |
| Tentang | 2 kolom (520 kiri, 600 kanan) | 1 kolom | 1 kolom |
| Kartu kegiatan | 4 × 282 | 2 × 332 | 1 × 350 |
| Kartu grup | 4 × 282 (horizontal) | 2 × 334 (horizontal) | 2 × 169 (vertikal) |
| Kartu webinar | 3 × 384, 6 item | 2 × 332, 6 item | 1 × 350, **3 item** |
| Kartu pengurus | 4 × 282 | 2 × 332 | 2 × 169 |
| FAQ | 400 kiri + 720 kanan | 1 kolom | 1 kolom |
| Footer | brand kiri, 2 kolom link kanan | stack + 2 kolom link | stack |

### 2.5 Radius

| Token | Nilai | Pemakaian |
|-------|-------|-----------|
| `--radius-xs` | 6px | Chip edisi webinar |
| `--radius-sm` | 8px | Chip "WEBINAR BERIKUTNYA" |
| `--radius-md` | 16px | Kotak ikon kegiatan (60×60) |
| `--radius-lg` | 20px | Kartu grup, item FAQ, foto pengurus |
| `--radius-xl` | 24px | Kartu kegiatan, kartu webinar, banner webinar, kartu Visi, hero slider |
| `--radius-2xl` | 32px | Kartu CTA Gabung |
| `--radius-full` | 9999px | Tombol, tab, tagline pill, logo grup, ikon FAQ, kontrol slider |

### 2.6 Border, Shadow, Ornamen

- Border standar **1.5px** (tombol outline, tab, kartu, pill). Divider 1px.
- Shadow hanya pada hero slider: `0 24px 50px rgb(0 0 0 / 0.45)` (`--shadow-float`). Elemen lain flat.
- Ornamen: lingkaran dekoratif besar di Hero (kanan atas), Webinar (kiri atas), CTA (kanan), dan lingkaran kecil di tepi hero. Ornamen di-export sebagai SVG ke `public/ornaments/`, `aria-hidden`, dan `pointer-events-none`.

### 2.7 Motion

| Token | Nilai | Pemakaian |
|-------|-------|-----------|
| `--duration-fast` | 150ms | Hover, fokus |
| `--duration-base` | 250ms | Accordion, menu, tab, slide |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | Transisi masuk |

Animasi hanya memakai `transform`/`opacity`. Accordion memakai `grid-template-rows`. Jika `prefers-reduced-motion`, matikan autoplay slider dan smooth scroll.

### 2.8 Ikon & Gambar

- Ikon kegiatan berupa **emoji** (🎙️ 💬 🤝 📍) di kotak `brand-50` 60×60. Emoji 📅 dan 💡 inline. Semua emoji dekoratif diberi `aria-hidden`.
- Panah ↗ ← → dan ikon FAQ "–"/"+" memakai **lucide-react** (`ArrowUpRight`, `ArrowLeft`, `ArrowRight`, `Minus`, `Plus`, `Menu`, `X`) agar rendering konsisten.
- Logo PCI berupa SVG (komponen instance di Figma), tersedia dalam varian putih (navbar/footer).

| Gambar | Rasio | Ukuran desktop |
|--------|-------|----------------|
| Hero slide | 9:10 desktop, 8:5 tablet, ~3:2 mobile (pakai `object-cover`) | 540×600 |
| Poster webinar | **1:1** | 384×384 |
| Foto pengurus | ~10:11 | 282×310 |
| Logo grup | 1:1, lingkaran | 72×72 |

Semua gambar memakai `next/image` dan `alt` deskriptif.

---

## 3. Komponen

ID `C-xx` dirujuk oleh [PRD §7](../PRD.md#7-matriks-keterlacakan). Path relatif terhadap `src/`.

### 3.1 Primitif (`components/ui`)

| ID | Komponen | Spesifikasi Figma | Fitur |
|----|----------|-------------------|-------|
| C-03 | `Logo` | SVG ikon + wordmark 2 baris. Ukuran: navbar 281×40 (mobile 225×32), footer 337×48 | F-01, F-11 |
| C-05 | `Button` | Pill, `px-7 py-4` (28/16), teks `button`, border 1.5px. Varian: **primary** (fill `brand-500`, teks `ink-900`) · **outline** (transparan, border `--color-outline`, teks `--color-fg`) · **dark** (fill `ink-900`, teks putih, dipakai di kartu CTA). Props `fullWidth` (mobile), `asChild`, `external` (tambah ikon ↗, `target=_blank`) | F-01, F-02, F-06, F-09 |
| C-06 | `Badge` | **pill**: border `white/22`, `px-4 py-2`, `body-sm` 600 (tagline hero) · **chip**: `brand/14`, radius-xs, `px-2.5 py-1`, `chip` `brand-500` (edisi webinar) · **status**: `brand/15`, radius-sm, `px-3 py-1.5`, `chip` + tracking 0.12em (WEBINAR BERIKUTNYA) · **caption**: putih, radius-full, `mono` 11px `ink-900` (caption slide) | F-02, F-06 |
| C-07 | `SectionHeading` | `eyebrow` (warna `--color-accent`) + `title` h2 (boleh `<em>`) + `description` `lead` muted. `align: center` (Kegiatan, Webinar, Pengurus; max-w 820) atau `left` (Tentang, FAQ) | F-04 – F-10 |
| C-08 | `Card` | `tone`: **surface** (fill `--color-surface`, radius-xl) · **outlined** (border 1.5 `stone-200`, radius-lg) · **inverse** (fill `ink-900`, teks putih, radius-xl, padding 40 — Visi) · **muted** (fill `stone-100`, radius-lg — FAQ) | F-04, F-05, F-10 |
| C-19 | `Tabs` | Pill `px-5 py-3`, teks 16/700, border 1.5 `white/22`. Aktif: fill `brand-500` teks `ink-900`. Rata tengah, gap 12. Mobile: scroll horizontal. Pola ARIA tablist | F-06, F-07 |
| C-22 | `Pagination` | Link pill memakai gaya Tab. Berupa `<a>` agar bisa di-crawl | F-07 |
| C-26 | `Accordion` | Item = Card `muted`, padding 28. Pertanyaan `faq-q`. Tombol ikon bulat 36px fill `ink-900` dengan ikon putih "–"/"+". Jawaban `body-sm` muted. `type="multiple"`, default semua terbuka | F-10 |
| C-15 | `FormField` *(P2)* | Belum ada di Figma | F-13, F-14 |
| C-16 | `Checkbox` *(P2)* | Belum ada di Figma | F-13 |
| C-27 | `Toast` *(P2)* | Belum ada di Figma | F-13, F-14 |

### 3.2 Layout (`components/layout`)

| ID | Komponen | Spesifikasi | Fitur |
|----|----------|-------------|-------|
| C-01 | `SiteNavbar` | Di dalam hero (tidak sticky), container 1200, tinggi 72, `mt-6`. Desktop: Logo, link `nav` `white/80` (hover putih) dengan gap 40, Button primary "Gabung Komunitas". < lg: Logo + tombol hamburger 48×48 | F-01 |
| C-02 | `MobileMenu` | Fullscreen `ink-900`. Baris atas: Logo + Close 48×48. Link `nav` mobile (26px/700) + panah →, setiap baris dipisah divider `white/10`. Button primary + outline full-width. Tagline `small` di bawah. Fokus terkunci, `Esc` menutup | F-01 |
| C-04 | `SiteFooter` | `ink-900`, padding atas 80. Brand (Logo + deskripsi `body-sm` `stone-300`, max-w 360) · kolom **Navigasi** & **Sosial Media** (judul 16/700 putih, link 16 `stone-300`, gap 16). Divider lalu baris bawah `small` `stone-300`: copyright kiri, tagline kanan (mobile stack) | F-11 |
| — | `Container` | `--container` + `--gutter` | semua |
| — | `Section` | Props `tone: light \| muted \| dark`, `id`, padding `--section-y` | semua |

### 3.3 Komposit (`features/*`)

| ID | Komponen | Anatomi (Figma) | Fitur |
|----|----------|-----------------|-------|
| C-10 | `HeroSection` | `Section dark` + ornamen. Kiri: Badge pill → H1 `display` (max-w 600) → lead `stone-300` (max-w 540) → 2 Button (gap 16) → stats. Kanan: HeroSlider. Tinggi desktop 839 | F-02 |
| C-11 | `StatItem` | Angka `stat` putih + label `meta` 500 `stone-300` 2 baris. Antar item ada pemisah vertikal 1.5×44 `white/15` | F-02 |
| C-12 | `HeroSlider` | Kartu radius-xl, border 1.5 `white/12`, `--shadow-float`. Slide gambar `object-cover`. Caption (Badge caption) di kiri atas. Controls kanan bawah: Counter (pill gelap `mono` 12 putih) + Prev/Next bulat 40px (desktop & tablet). Progress bar 3px di bawah slider (track `white/15`, isi `brand-500`). Mobile tanpa Prev/Next, navigasi swipe. Pola ARIA carousel (`aria-roledescription="carousel"`, live region) | F-02 |
| C-13 | `PartnerStrip` | Divider atas `white/10`. Label 15/600 `stone-300` tracking 0.06em, lalu nama partner 20/700 `white/55` (gap 40, wrap). Tinggi desktop 102 | F-03 |
| C-14 | `AboutSection` | Kiri: SectionHeading `left` + paragraf `lead` `stone-500` (max-w 520). Kanan: Card inverse "VISI" (eyebrow `brand-500` + `quote`), lalu "MISI" (eyebrow `brand-700`) dan daftar `<ol>`: nomor dalam lingkaran 32px (`brand-50`, teks 15/700 `brand-700`) + teks `body` | F-04 |
| C-17 | `ActivityCard` | Card surface, padding 28. Kotak ikon 60 `brand-50` radius-md berisi emoji 28px → `title` → `meta` `stone-500` (16/1.5). Tinggi desktop 249 | F-05 |
| C-18 | `GroupCard` | Card outlined, padding 18.5. Logo bulat 72 + nama 18/700 + deskripsi `small` `stone-500`. Desktop/tablet horizontal, mobile vertikal (logo di atas) | F-05 |
| C-20 | `NextWebinarBanner` | Card `ink-800`, border 1.5 `brand/50`, radius-xl, padding 34. Badge status "WEBINAR BERIKUTNYA" → `h4` putih → `body` 16 `stone-300` (max-w 700) → Button outline external "Follow Instagram ↗" (desktop di kanan, mobile di bawah) | F-06 |
| C-21 | `WebinarCard` | Card `ink-800`, border 1.5 `white/8`, radius-xl, overflow hidden. Poster 1:1 → padding 22.5: Badge chip edisi → judul `title` putih (LH 1.25, maks 3 baris) → pembicara `meta` `stone-300` → divider `white/10` → baris bawah: "📅 {tanggal}" `meta` 500 `stone-300` kiri dan "Lihat di IG ↗" `meta` 700 `brand-500` kanan. Satu `<a>` external membungkus kartu | F-06, F-07 |
| C-24 | `TeamCard` | Foto radius-lg (282×310) → nama `title` `ink-900` → peran 16 `stone-500` → "LinkedIn ↗" `meta` 700 `brand-700` (link external) | F-08 |
| C-25 | `CtaBanner` | Kartu `brand-500` radius-2xl (desktop 1200×340, padding 60) + 2 ornamen lingkaran kanan. Heading `h3` `ink-900` (max-w 860) → `lead` `ink-900`/80 (max-w 720) → Button dark external + Button outline (border `ink-900`). Mobile: tombol full-width bertumpuk | F-09 |
| C-23 | `EventMeta` *(P2)* | Untuk halaman detail webinar, belum ada di Figma | F-13 |

ID `C-09` dicadangkan.

### 3.4 State wajib

| State | Aturan |
|-------|--------|
| Hover | Tombol primary jadi `brand-500` 90% + panah ↗ bergeser 2px. Outline: fill `white/8` (gelap) atau `ink-900/5` (terang). Link: warna `--color-fg` + underline. Transisi `--duration-fast` |
| Focus-visible | Ring 2px `--color-focus` offset 2px. `outline: none` tidak boleh dipakai tanpa pengganti |
| Active (tab) | Fill `primary` + `aria-selected="true"` |
| Disabled | Opacity 50%, `aria-disabled` |
| Empty | Tab tanpa data: teks `body` muted di tengah grid |

Target sentuh minimal 44×44. Tombol slider 40px diberi hit area 44px lewat padding transparan.

### 3.5 CMS

Komponen dan token CMS `/admin` ada di [design-admin.md](design-admin.md). Token situs publik di dokumen ini tidak dipakai di CMS, dan sebaliknya.

---

## 4. Urutan Section Landing

| # | Section (`id`) | Tone | Komponen | Node desktop |
|---|----------------|------|----------|--------------|
| 1 | Hero | dark | C-01, C-10, C-11, C-12 | `1:25` |
| 2 | Kolaborasi | dark | C-13 | `1:67` |
| 3 | Tentang `#tentang` | light | C-14 | `1:75` |
| 4 | Kegiatan `#kegiatan` | muted | C-07, C-17, C-18 | `1:98` |
| 5 | Webinar `#webinar` | dark | C-07, C-19, C-20, C-21, C-05 | `1:140` |
| 6 | Pengurus `#pengurus` | light | C-07, C-24 | `1:215` |
| 7 | CTA Gabung | light | C-25 | `1:239` |
| 8 | FAQ `#faq` | light | C-07, C-26 | `1:249` |
| 9 | Footer | dark | C-04 | `1:273` |

## 5. Breakpoint

| Tailwind | Min width | Frame Figma | Perubahan utama |
|----------|-----------|-------------|-----------------|
| base | 0 | Mobile 390 | Gutter 20, 1 kolom, CTA full-width, webinar 3 item, slider tanpa prev/next |
| `md` | 768 | Tablet 768 | Gutter 40, grid 2 kolom, webinar 6 item |
| `lg` | 1024 | — | Navbar inline (hamburger hilang) |
| `xl` | 1280 | Desktop 1440 | Container 1200, Hero/Tentang/FAQ 2 kolom, grid 3–4 kolom |

Desain dibuat mobile-first. Uji di lebar 360, 390, 768, 1024, dan 1440.

## 6. Aturan Konsistensi

1. Hex/px literal hanya boleh ada di `globals.css`. Komponen memakai token.
2. Semua judul section lewat `SectionHeading`. Satu `h1` per halaman, section `h2`, kartu `h3`.
3. Semua tombol lewat `Button`. Link eksternal memakai prop `external`, sehingga ikon ↗, `target="_blank"`, dan `rel="noopener noreferrer"` otomatis.
4. Maksimal satu Button primary per area pandang. Di kartu CTA, peran primary dipegang varian `dark`.
5. Warna permukaan hanya diatur lewat `Section tone`.
6. Copy santai: pakai "kamu", tanpa "Anda". Teks CTA mengikuti Figma persis.
7. Komponen baru wajib mendapat ID `C-xx` di tabel §3 dan dipetakan di [PRD §7](../PRD.md#7-matriks-keterlacakan).
8. Figma adalah sumber kebenaran visual. Perubahan token harus melalui Figma dulu.

## 7. Implementasi Token

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-ink-900: #1a1a19;
  --color-ink-800: #262624;
  --color-stone-500: #6b6b66;
  --color-stone-300: #b3b3ae;
  --color-stone-200: #e7e7e3;
  --color-stone-100: #f4f4f1;
  --color-brand-50: #e3f8f2;
  --color-brand-500: #02d6a6;
  --color-brand-700: #017057;

  --font-sans: var(--font-dm-sans), system-ui, sans-serif;
  --font-mono: var(--font-dm-mono), ui-monospace, monospace;

  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-2xl: 32px;

  --shadow-float: 0 24px 50px rgb(0 0 0 / 0.45);
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
}

[data-tone="light"], :root {
  --color-bg: var(--color-white);
  --color-surface: var(--color-white);
  --color-fg: var(--color-ink-900);
  --color-fg-muted: var(--color-stone-500);
  --color-border: var(--color-stone-200);
  --color-divider: var(--color-stone-200);
  --color-accent: var(--color-brand-700);
  --color-primary: var(--color-brand-500);
  --color-on-primary: var(--color-ink-900);
  --color-outline: var(--color-ink-900);
  --color-focus: var(--color-brand-700);
}

[data-tone="muted"] {
  --color-bg: var(--color-stone-100);
}

[data-tone="dark"] {
  --color-bg: var(--color-ink-900);
  --color-surface: var(--color-ink-800);
  --color-fg: var(--color-white);
  --color-fg-muted: var(--color-stone-300);
  --color-border: rgb(255 255 255 / 0.08);
  --color-divider: rgb(255 255 255 / 0.10);
  --color-accent: var(--color-brand-500);
  --color-outline: rgb(255 255 255 / 0.35);
  --color-focus: var(--color-brand-500);
  color-scheme: dark;
}
```
