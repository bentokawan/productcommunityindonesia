# design-admin — Design System CMS `/admin`

| Atribut | Nilai |
|---------|-------|
| Status | v0.1 — 2026-11-23 |
| Sumber | Pola **Monochrome Soft** dari proyek Albana Speech Academy (desain admin yang sama dipakai ulang): `albanaspeechacademy/docs/albana-docs/design/admin-ui-patterns.md` + kit kode `albanaspeechacademy/front/components/admin/ui/*`, `components/admin/shell/AdminShell.tsx`, `lib/admin-nav.ts`, token `.admin-shell` di `front/app/globals.css` |
| Cakupan | Semua halaman `src/app/(admin)/admin/**`. Situs publik memakai [design-web.md](design-web.md) |
| Dokumen terkait | [PRD](../PRD.md) F-16 – F-19 · [ARCHITECTURE §9](../ARCHITECTURE.md#9-cms-admin) · [AGENTS](../AGENTS.md) |

> **Aturan sumber.** Nilai di dokumen ini disalin dari referensi Albana yang sudah diterapkan. Yang diubah hanya: merek (PCI), daftar modul (PCI), role (`admin`/`editor`), dan pola data (Server Action + RLS, ARCHITECTURE §9.5). Ekspor CSV, kartu sorotan tagihan, dan kontrol Rupiah/telepon **tidak** dipakai karena PCI tidak punya data itu.

---

## 1. Karakter

Alat kerja yang tenang dan padat informasi: kanvas putih, permukaan abu sangat muda yang besar dan membulat, hitam untuk satu penekanan utama, dan nada lembut hanya untuk status kecil.

| Referensi | Di CMS PCI |
|-----------|-----------|
| Kanvas putih, kerangka monokrom | Sama. **Hijau brand PCI (`brand-500`) hanya di logo**, tidak di UI admin |
| Header berisi logo, tema, akun | Sama: logo PCI + "PCI CMS", toggle tema, menu akun (Akun Saya, Lihat Situs ↗, Keluar) |
| Satu sidebar berisi grup + sub-menu berbentuk pil, aktif hitam | Sama. Grup mengikuti modul PCI (§3.2) dan role |
| Judul halaman besar dan ringan | Sama (40/400) |
| Tombol ikon bulat, tombol teks & input berbentuk pil | Sama |
| Kartu sorotan hitam (tagihan menunggu) | Dashboard: "Webinar berikutnya" (satu per layar) |
| Kartu mint untuk hal yang sudah beres | Dashboard: konten yang sudah lengkap |
| Font Plus Jakarta Sans | Sama, hanya dimuat di route group `(admin)` |

---

## 2. Token

### 2.1 Warna

Dideklarasikan pada `.admin-shell, body:has(.admin-shell)` di `src/app/globals.css` (selector kedua menjangkau dialog yang di-portal ke `<body>`). Prefix `--admin-` agar tidak bentrok dengan token situs ([design-web §7](design-web.md#7-implementasi-token)).

| Token | Terang | Gelap | Pakai |
|-------|--------|-------|-------|
| `--admin-canvas` | `#FFFFFF` | `#0B0B0B` | Latar aplikasi, kartu form, dialog |
| `--admin-surface` | `#F6F6F6` | `#161616` | Sidebar, kartu daftar, isian, pil pasif, tombol bulat |
| `--admin-surface-muted` | `#EDEDED` | `#222222` | Hover, chip pasif, skeleton |
| `--admin-ink` | `#0B0B0B` | `#F5F5F5` | Teks utama, pil aktif, tombol utama, kartu sorotan |
| `--admin-ink-soft` | `#2A2A2A` | `#D9D9D9` | Hover tombol utama |
| `--admin-on-ink` | `#FFFFFF` | `#0B0B0B` | Teks di atas `--admin-ink` |
| `--admin-text-secondary` | `#5C5C5C` | `#A8A8A8` | Meta, breadcrumb, label kolom, petunjuk |
| `--admin-text-faint` | `#8F8F8F` | `#6E6E6E` | Placeholder, nilai kosong "—", angka ≥ 32 px saja |
| `--admin-line` | `#E5E5E5` | `#2A2A2A` | Garis pemisah, tepi kartu & isian |
| `--admin-line-strong` | `#C9C9C9` | `#3D3D3D` | Tepi tombol bulat, hover isian, kotak putus-putus |
| `--admin-danger` | `#B42318` | `#F97066` | Galat, `*` wajib, aksi hapus |

**Nada lembut** (`--admin-{nada}-soft`, `-ink`, `-dot`). Hanya untuk unsur kecil: chip status, titik, lencana, latar galat.

| Nada | `-soft` | `-ink` | `-dot` | Makna di PCI |
|------|---------|--------|--------|--------------|
| `mint` | `#DDF1E4` | `#1E6A3C` | `#22A35A` | Tampil, aktif, akan datang |
| `peach` | `#FDE7DA` | `#9A4A1F` | `#E8833A` | Perlu dilengkapi (mis. webinar tanpa poster) |
| `rose` | `#FBE1E1` | `#A3282A` | `#E5484D` | Nonaktif, latar galat |
| `butter` | `#FBF6C8` | `#6B5D00` | `#E1C100` | Sorotan (maks 3 unsur per layar) |
| `lilac` | `#ECE7FA` | `#5B47A8` | `#7C66D9` | Kategori, role `editor` |

Gelap untuk nada: lihat referensi (`-soft` gelap `#15291D`, `#33201A`, `#331A1A`, `#2E2B12`, `#221D33`; `-ink` gelap `#9FE0B5`, `#F6B894`, `#F4A3A3`, `#F2E58A`, `#C3B5F2`).

Aturan: hitam adalah penekanan utama. Satu nada = satu makna. Teks di atas `-soft` memakai `-ink` nada yang sama. Status netral ("Disembunyikan", "Lewat") memakai `surface-muted` + `text-secondary`.

### 2.2 Tipografi

Plus Jakarta Sans 300/400/500/600 via `next/font/google` di `src/app/(admin)/admin/layout.tsx`, variabel `--font-admin`. Fallback `ui-sans-serif, system-ui, sans-serif`. Bobot ≥ 700 hanya untuk lencana nomor dan judul bagian form.

| Peran | Ukuran / LH | Bobot |
|-------|-------------|-------|
| Display angka | 64/1.0 (`tabular-nums`, −0.02em); ponsel 32/40/48 | 400 |
| Judul halaman | 40/1.1 (−0.02em); < 640: 24, 640–767: 28 | 400 |
| Judul kartu | 22/1.3 | 500 |
| Judul modal | 20 (ponsel 18) | 600 |
| Judul bagian form | 16 (ponsel 15), uppercase, 0.04em | 700 |
| Isi, sel tabel, input | 14/1.5 — **input 16 di < 768 px** (cegah zoom iOS) | 400 |
| Label field | 13/1.4 | 500 |
| Pil navigasi, tombol | 15/1 | 400 (aktif 500) |
| Meta, breadcrumb | 14/1.4 | 400 |
| Chip | 12/1 | 500 |

### 2.3 Bentuk, ruang, bayangan

| Unsur | Radius | Ukuran |
|-------|--------|--------|
| Kartu | 32 | padding 28 (ponsel 20) |
| Kartu dalam kartu, grid media | 24 | padding 20 |
| Kartu form halaman | 28 (ponsel 24) | padding 40 (ponsel 20) |
| Pil navigasi sidebar | 999 | tinggi 44, padding 0 14, ikon 18 |
| Tombol bulat besar (aksi kepala) | 50% | 48–56 |
| Tombol ikon baris | 50% | 36 |
| Tombol teks | 999 | tinggi 48, padding 0 24 |
| Input satu baris / select | 999 | tinggi 48, padding 0 18 |
| Textarea | 20 | padding 14/18, min 104 |
| Chip status | 999 | tinggi 26, padding 0 10, titik 6 |
| Avatar | 50% | 36–40 |

Spasi basis 4: antarkartu 20, antarbagian 32, kanvas ke tepi 40 (ponsel 16).
Bayangan hanya untuk lapisan terangkat: dropdown/popover `0 12px 32px rgba(0,0,0,.10)`, dialog `0 32px 80px rgba(0,0,0,.18)`. Kartu tanpa bayangan.

### 2.4 Ikon

`lucide-react`, garis 1.5, 18 px (pil, baris) / 20–22 px (tombol bulat). Ikon tanpa teks wajib `aria-label` + `title`.

### 2.5 Implementasi

```css
/* src/app/globals.css */
.admin-shell, body:has(.admin-shell) {
  --admin-canvas: #ffffff; --admin-surface: #f6f6f6; --admin-surface-muted: #ededed;
  --admin-ink: #0b0b0b; --admin-ink-soft: #2a2a2a; --admin-on-ink: #ffffff;
  --admin-text-secondary: #5c5c5c; --admin-text-faint: #8f8f8f;
  --admin-line: #e5e5e5; --admin-line-strong: #c9c9c9; --admin-danger: #b42318;
  --admin-mint-soft: #ddf1e4; --admin-mint-ink: #1e6a3c; --admin-mint-dot: #22a35a;
  /* … peach, rose, butter, lilac (§2.1) … */
  --admin-radius-card: 32px; --admin-shadow-pop: 0 12px 32px rgba(0,0,0,.10);
  --admin-shadow-overlay: 0 32px 80px rgba(0,0,0,.18);
  --ease-out: cubic-bezier(.23,1,.32,1); --ease-in-out: cubic-bezier(.77,0,.175,1);
  --ease-spring: cubic-bezier(.34,1.36,.64,1);
  font-family: var(--font-admin), ui-sans-serif, system-ui, sans-serif;
}
.dark .admin-shell, body:has(.admin-shell.dark) { /* nilai gelap §2.1 */ }

@theme inline {
  --color-admin-canvas: var(--admin-canvas);
  --color-admin-surface: var(--admin-surface);
  --color-admin-surface-muted: var(--admin-surface-muted);
  --color-admin-ink: var(--admin-ink);
  --color-admin-ink-soft: var(--admin-ink-soft);
  --color-admin-on-ink: var(--admin-on-ink);
  --color-admin-text-secondary: var(--admin-text-secondary);
  --color-admin-text-faint: var(--admin-text-faint);
  --color-admin-line: var(--admin-line);
  --color-admin-line-strong: var(--admin-line-strong);
  --color-admin-danger: var(--admin-danger);
  --color-admin-mint-soft: var(--admin-mint-soft); /* … semua nada … */
}
```

Utilitas yang dihasilkan: `bg-admin-surface`, `text-admin-ink`, `border-admin-line`, dst. Tema gelap: class `dark` pada `.admin-shell`, disimpan di `localStorage` (`pci-admin-theme`), default terang. Tanpa `next-themes`.

---

## 3. Kerangka aplikasi

```text
╭──────────────────────────────────────────────────────────────────────────────╮
│ ☰ (◉) PCI CMS                                                    (◐)  (A) ˅ │ ← header 72, lengket
╰──────────────────────────────────────────────────────────────────────────────╯
╭───────────────────╮
│ ▣ Dashboard       │   Konten Beranda  ⟶  FAQ                                    ← breadcrumb 14
│                   │   FAQ                    (⌕ Cari FAQ…)        (● + Tambah FAQ)
│ Konten Beranda   ˅│   Pertanyaan yang tampil di section FAQ beranda.          ← deskripsi dari nav.ts
│   ○ Hero          │
│   ○ Kolaborasi    │   ┌──────────────────────────────────────────────────────┐
│   ○ Kegiatan      │   │ Pertanyaan              Status     Urutan            │ ← kepala tabel abu
│   ○ Grup Komunitas│   └──────────────────────────────────────────────────────┘
│   ○ Pengurus      │     Apakah gabung PCI berbayar?  • Tampil   (↑)(↓)   (✎)(🗑)
│   ● FAQ           │   ─────────────────────────────────────────────────────────
│ Webinar          ˅│
│   ○ Semua Webinar │
│   ○ Kategori      │   ← hanya admin
│ Pengaturan       ˅│   ← grup hanya admin
│   ○ Link & Sosial │
│   ○ Pengguna      │
│   ○ Log Aktivitas │
╰───────────────────╯
```

### 3.1 Header (C-28)

| Unsur | Aturan |
|-------|--------|
| Wadah | Tinggi 72, `--admin-canvas`, garis bawah 1 px `--admin-line`, lengket, lebar penuh |
| Kiri | < 1024 px: tombol ☰ 44 px. Tombol bulat logo 44 px (latar `#0B0B0B`, logo PCI putih) + "PCI CMS" 15/500 → `/admin` |
| Kanan | Tombol bulat tema 44 px. Tombol akun: avatar 36 (inisial) + nama 14 + chevron → menu: nama + role (chip), **Akun Saya**, **Lihat Situs ↗**, **Keluar**. < 768 px: avatar saja |
| Tidak boleh | Tautan modul, breadcrumb, cari global |

### 3.2 Sidebar (C-29)

| Unsur | Aturan |
|-------|--------|
| Wadah | Panel `--admin-surface` radius 32, 12 px dari tepi kiri & bawah, lebar 264, lengket di bawah header; isi bergulir sendiri |
| Dashboard | Item tunggal di atas grup |
| Judul grup | 12/500 `--admin-text-secondary`, tombol buka/tutup + chevron 16, `aria-expanded`. Grup yang memuat halaman aktif selalu terbuka; lainnya diingat di `localStorage` (`pci-admin-nav-open`) |
| Item | Pil 44, ikon 18 + label 15/400, jarak 2. Hover `--admin-surface-muted` |
| Item aktif | Pil `--admin-ink`, ikon & label `--admin-on-ink` 500, `aria-current="page"` |
| Role | Item/grup yang tidak boleh diakses role **tidak dirender** (`nav.ts` → `roles`) |

Sumber tunggal: `src/features/admin/shell/nav.ts`, struktur sama dengan `lib/admin-nav.ts` Albana:

```ts
export type AdminRole = "admin" | "editor";
export type NavModule = { label: string; href: string; icon: NavIcon; description: string; roles?: AdminRole[] };
export type NavGroup = { id: string; label: string; href: string; icon: NavIcon; modules: NavModule[]; roles?: AdminRole[]; description?: string };

export const NAV_GROUPS: NavGroup[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: "dashboard", modules: [], description: "Ringkasan konten situs PCI." },
  { id: "beranda", label: "Konten Beranda", href: "/admin/hero", icon: "home", modules: [
    { label: "Hero", href: "/admin/hero", icon: "image", description: "Slide dan statistik di bagian paling atas beranda." },
    { label: "Kolaborasi", href: "/admin/partners", icon: "handshake", description: "Nama partner yang tampil di strip Kolaborasi." },
    { label: "Kegiatan", href: "/admin/activities", icon: "sparkles", description: "Kartu kegiatan komunitas di section Kegiatan." },
    { label: "Grup Komunitas", href: "/admin/groups", icon: "users", description: "Grup WhatsApp tematik beserta logonya." },
    { label: "Pengurus", href: "/admin/team", icon: "id-card", description: "Profil pengurus di section Pengurus." },
    { label: "FAQ", href: "/admin/faqs", icon: "help", description: "Pertanyaan yang tampil di section FAQ beranda." },
  ]},
  { id: "webinar", label: "Webinar", href: "/admin/events", icon: "video", modules: [
    { label: "Semua Webinar", href: "/admin/events", icon: "video", description: "Webinar yang tampil di beranda dan arsip /webinar." },
    { label: "Kategori", href: "/admin/event-categories", icon: "tag", description: "Kategori yang menjadi tab di section Webinar.", roles: ["admin"] },
  ]},
  { id: "pengaturan", label: "Pengaturan", href: "/admin/settings", icon: "settings", roles: ["admin"], modules: [
    { label: "Link & Sosial Media", href: "/admin/settings", icon: "link", description: "Link WhatsApp, Instagram, dan LinkedIn di seluruh situs." },
    { label: "Pengguna", href: "/admin/users", icon: "shield", description: "Undang pengurus dan atur role admin/editor." },
    { label: "Log Aktivitas", href: "/admin/audit-log", icon: "activity", description: "Riwayat perubahan konten oleh pengguna CMS." },
  ]},
];
```

### 3.3 Kepala halaman (C-40)

- Dirender **sekali oleh shell**: breadcrumb `Grup ⟶ Modul` (14, `--admin-text-secondary`), judul 40/400, deskripsi 15 satu kalimat dari `nav.ts`.
- Kanan: bilah alat (§8.2). Halaman detail/form: tombol bulat ← sebelum breadcrumb, judul spesifik ("Ubah #SharingSession7") lewat `AdminPageTitle`.
- Modul **tidak** membuat judul sendiri.

### 3.4 Responsif

| Lebar | Header | Sidebar | Konten |
|-------|--------|---------|--------|
| ≥ 1280 | Logo + nama, tema, avatar + nama | Terbuka 264 | 12 kolom |
| 1024–1279 | Sama | Ringkas 80 (ikon + tooltip), tombol ⟷, diingat `pci-admin-nav-compact` | 8 kolom |
| 768–1023 | ☰ + logo | Laci kiri 300, backdrop 30%, Escape/ketuk luar/pilih item menutup | 1–2 kolom |
| < 768 | ☰ + logo, avatar saja | Laci | 1 kolom, judul 24–28, tabel jadi kartu |

---

## 4. Gerak

Token: `--ease-out`, `--ease-in-out`, `--ease-spring` (hanya pil & tombol bulat); durasi press 90, hover 140, micro 180, pop 220, overlay 280, exit 180 ms.

| Unsur | Gerak |
|-------|-------|
| Tombol bulat ditekan | `scale(.92)` 90 ms → kembali `--ease-spring` 220 ms |
| Sub-menu buka/tutup | tinggi 0↔auto 200 ms, chevron 180° |
| Laci sidebar | `translateX(-100%)→0` 280 ms, keluar 180 ms |
| Dialog masuk / keluar | opacity + `translateY(24px)` + `scale(.96)→1` 280 ms / 180 ms |
| Lembar bawah (< 640) | `translateY(100%)→0` 320 ms |
| Kepala & isi saat pindah modul | fade + `translateY(6px)` 160 ms |
| Baris baru/diubah | latar `--admin-butter-soft` memudar 1.2 s |
| Baris dihapus | opacity + `scale(.98)` 180 ms |

Aturan: hanya `transform`/`opacity`. Tidak ada gerak saat mengetik, menyaring, ganti halaman, atau mengurutkan. Fokus pindah seketika. `prefers-reduced-motion`: semua durasi 1 ms. Pil aktif sidebar **tidak** meluncur (referensi memakai `motion` `layoutId`; PCI tidak menambah dependency itu).

---

## 5. Templat halaman

| Kode | Templat | Isi |
|------|---------|-----|
| **T1** | Daftar | Kepala + bilah alat → tabel (§8.3) **atau** grid kartu (kartu 24) → paginasi. Tambah/ubah lewat **dialog di halaman yang sama** bila form ringkas (§6.1) |
| **T2** | Form halaman | Tombol ← + judul spesifik → kartu form putih 760/1120 dengan bagian bernomor → kaki Batal + Simpan |
| **T3** | Panel samping | Daftar tetap terlihat (redup 40%), panel 520 px dari kanan radius 32; < 768 lembar bawah |
| **T4** | Dashboard | Kartu sorotan hitam + kartu metrik putih (ikon berbingkai + angka display) + panel daftar ringkas |

### 5.1 Peta modul PCI → templat

| Modul | Daftar | Tambah / ubah | Field | Catatan |
|-------|--------|---------------|-------|---------|
| Dashboard | T4 | — | — | Sorotan hitam: webinar berikutnya. Metrik: webinar terbit, FAQ, pengurus. Panel "Perlu dilengkapi" (event tanpa poster/IG, slide tanpa alt) |
| Hero · Slide | T1 grid kartu media (rasio slider design-web C-12) + urutkan | Dialog `lg` | 5 (gambar, alt, caption, caption panjang, tampil) | Tab Slide · Statistik (C-19 gaya admin: pil segmen) |
| Hero · Statistik | T1 tabel kecil + urutkan | Dialog `sm` | 2 (angka, label) | Maks 4 |
| Kolaborasi | T1 tabel + urutkan | Dialog `sm` | 2 (nama, URL) | Partner PCI hanya teks, jadi tabel, bukan kartu logo |
| Kegiatan | T1 tabel + urutkan | Dialog `md` | 3 (emoji, judul, deskripsi) | |
| Grup Komunitas | T1 grid kartu logo bulat + urutkan | Dialog `lg` | 3 (logo, nama, deskripsi) | |
| Pengurus | T1 grid kartu potret + urutkan | Dialog `lg` | 5 (foto, nama, peran, LinkedIn, tampil) | Sampel B (§12) |
| FAQ | T1 tabel + urutkan | Dialog `md` | 3 (pertanyaan, jawaban, tampil) | Sampel A (§12) |
| Semua Webinar | T1 tabel + saring kategori/status | **T2 halaman** (`/new`, `/[id]`) | 9 | > 6 field + unggah poster → halaman (§6.1) |
| Kategori | T1 tabel + urutkan | Dialog `sm` | 2 (nama, slug) | admin |
| Link & Sosial Media | — | **T2 ringkas** satu kartu | 4 | Sampel C (§12) |
| Pengguna | T1 tabel | Dialog `sm` (undang: email, role) · dialog `sm` (ubah role) | 2 | admin |
| Log Aktivitas | T1 tabel read-only + saring tabel/user | — | — | Detail diff di T3 |
| Akun Saya | — | T2 ringkas (nama, password, hubungkan Google) | 3 | dibuka dari menu akun |

---

## 6. Dialog (C-35)

### 6.1 Modal atau halaman

Aturan pertama yang cocok menentukan: (1) editor teks kaya, baris berulang, > 1 unggahan → halaman; (2) > 6 field → halaman; (3) perlu bisa di-bookmark → halaman; (4) selain itu → modal. Konfirmasi selalu modal.

| Ukuran | Lebar | Pakai |
|--------|-------|-------|
| `sm` | 440 | Konfirmasi, form 1–2 field. Satu kolom |
| `md` | 560 | Form 3–6 field (bawaan). Satu kolom |
| `lg` | 720 | Form dengan satu unggah gambar + pratinjau, atau pasangan field. Boleh dua kolom |

### 6.2 Anatomi

```text
╭──────────────────────────────────────────────────╮
│  (■)  Tambah FAQ                            (×)  │ ← bulatan 44 --admin-ink + ikon putih 20 · judul 20/600
│       Pertanyaan tampil di section FAQ beranda.  │   subjudul 14 --admin-text-secondary
│ ──────────────────────────────────────────────── │
│  Pertanyaan *                                    │
│  ( ____________________________________ )        │
│  Jawaban *                                       │
│  ╭──────────────────────────────────────╮        │
│  ╰──────────────────────────────────────╯        │
│  ╭ ☑ Tampilkan di situs ───────────────╮         │ ← CheckboxCard nada mint
│ ──────────────────────────────────────────────── │
│  (       Batal       )  (■   Simpan FAQ   )      │ ← dua pil sama lebar, tinggi 48
╰──────────────────────────────────────────────────╯
```

- Wadah radius 32, `--admin-canvas`, bayangan overlay, backdrop `rgba(14,14,14,.45)` + blur 4 px. Badan padding 24 (ponsel 20), antarfield 20, tinggi maks `min(760px, 100dvh − 48px)`, badan bergulir sendiri.
- Label aksi = kata kerja + objek ("Simpan FAQ", "Undang pengguna").
- **< 640 px:** lembar bawah lebar penuh, radius atas 28, pegangan 40×4, aksi utama di atas Batal (keduanya lebar penuh), `padding-bottom: max(20px, env(safe-area-inset-bottom))`.
- **Konfirmasi hapus (C-33):** kartu `--admin-ink` teks putih, kalimat "Tindakan ini tidak dapat dibatalkan.", tombol hapus `--admin-danger`, Batal `--admin-ink-soft`, fokus awal di **Batal**.

### 6.3 Perilaku

| Situasi | Perilaku |
|---------|----------|
| Buka | Fokus ke field pertama (konfirmasi: ke Batal) |
| Escape / backdrop / × | Tutup bila belum berubah; bila berubah → "Buang perubahan?" |
| Simpan | Tombol jadi spinner + "Menyimpan…", field nonaktif |
| Berhasil | Dialog tutup → toast → baris disorot |
| Gagal validasi | Galat di bawah field, fokus ke galat pertama |
| Gagal server | Banner `--admin-rose-soft` di atas field pertama + **Coba lagi**; isian utuh |
| Tutup | Fokus kembali ke pemicu |

---

## 7. Formulir (C-36, C-37)

### 7.1 Field

```text
Pertanyaan *                                 ← label 13/500 --admin-ink · * --admin-danger · 8 px ke kontrol
╭──────────────────────────────────────────╮
│  Apakah gabung komunitas PCI berbayar?   │ ← pil 48 · latar --admin-surface · tepi 1 px --admin-line · px 18
╰──────────────────────────────────────────╯
Maksimal 160 karakter.                       ← petunjuk 12 --admin-text-secondary (galat: --admin-danger, role=alert)
```

| Keadaan | Latar | Tepi | Cincin |
|---------|-------|------|--------|
| Diam | `--admin-surface` | `--admin-line` | — |
| Hover | `--admin-surface` | `--admin-line-strong` | — |
| Fokus | `--admin-canvas` | `--admin-ink` | 2 px `--admin-ink` 8% |
| Galat (`aria-invalid`) | `--admin-rose-soft` | `--admin-danger` | fokus: 2 px danger 15% |
| Nonaktif | `--admin-canvas` | `--admin-line` | teks `--admin-text-faint` |

Kelas isian (salin dari referensi `controls.tsx`):

```ts
export const adminFieldClass =
  "h-12 w-full rounded-full border border-admin-line bg-admin-surface px-[18px] text-base md:text-sm text-admin-ink placeholder:text-admin-text-faint transition-[border-color,box-shadow,background-color] duration-150 hover:border-admin-line-strong outline-none focus-visible:border-admin-ink focus-visible:bg-admin-canvas focus-visible:ring-2 focus-visible:ring-admin-ink/8 aria-invalid:border-admin-danger aria-invalid:bg-admin-rose-soft disabled:cursor-not-allowed disabled:bg-admin-canvas disabled:text-admin-text-faint";
```

- Label huruf kalimat; hanya judul bagian yang kapital. Wajib = `*` + `aria-required`. Placeholder hanya contoh format.
- Tombol & tautan: fokus `outline` 2 px `--admin-ink` offset 2.
- Ruang galat dicadangkan (`min-h-5`).

### 7.2 Grid & bagian

- `FieldGrid columns={1}` untuk modal `sm`/`md`; dua kolom hanya modal `lg` (≥ 640) dan halaman (≥ 768).
- `Field span`: `full` (bawaan) · `half` (selalu berpasangan, mis. tanggal + jam) · `narrow` 160 px (urutan, angka pendek).
- Halaman form (`FormPage`, `FormSection`): kartu 28/40, lencana nomor 28 px, judul bagian 16/700 uppercase, maks 5 bagian, kaki **Batal** (pil `--admin-surface`) + aksi utama (pil hitam) rata kanan; ponsel menumpuk, aksi utama di atas.

### 7.3 Kontrol

| Data PCI | Kontrol |
|----------|---------|
| Teks pendek, URL, email | `AdminInput` (`type="url"`/`"email"`, `inputMode` sesuai) |
| Jawaban FAQ, deskripsi | `AdminTextarea` + penghitung karakter kanan bawah |
| Kategori, role | `AdminSelect` (> 4 opsi) atau pil segmen dalam kapsul `--admin-surface-muted` (2–4 opsi, aktif hitam) |
| Tanggal + jam webinar | `AdminInput type="date"` + `type="time"` berpasangan (`half`), label "WIB" |
| Tampil/sembunyi | `CheckboxCard` nada `mint` ("Tampilkan di situs") |
| Emoji kegiatan | `AdminInput` `narrow`, maks 8 karakter |
| Gambar | `ImageUpload` §7.4 |

### 7.4 Unggah gambar (C-32)

| Keadaan | Tampilan |
|---------|----------|
| Diam | Kotak tepi putus-putus `--admin-line-strong` radius 24, ikon ⬆, "Seret gambar ke sini atau **Pilih berkas**", "WebP, PNG, JPEG · maks 2 MB" |
| Seret di atas | Bidang `--admin-ink`, teks putih |
| Terpilih | Pratinjau sesuai rasio target (slide = C-12, poster 1:1, logo bulat, foto 282:310) + **Ganti** / **Hapus** |
| Mengunggah | Bilah progres hitam + "Mengunggah…" |
| Ditolak | Galat spesifik di bawah ("Ukuran maksimal 2 MB.") |

Berkas dipilih di klien (pratinjau `URL.createObjectURL`), diunggah **bersama submit form** ke Server Action (ARCHITECTURE §4.5). Tidak ada upload langsung dari browser ke Storage.

### 7.5 Validasi & simpan

1. Blur: periksa field itu. 2. Mengetik di field galat: hapus galat begitu sah. 3. Simpan: periksa semua, fokus galat pertama, banner "N isian perlu diperbaiki". Field belum disentuh tidak divalidasi sebelum simpan pertama.

Bilah simpan (T2): titik `butter` + "Belum tersimpan" → "Menyimpan…" → titik `mint` + "Tersimpan 14.32" (4 detik). Meninggalkan halaman dengan perubahan → "Buang perubahan?". Ctrl/⌘+S menyimpan.

---

## 8. Daftar data

### 8.1 Bentuk

| Bentuk | Modul PCI |
|--------|-----------|
| **Tabel** | FAQ, Kegiatan, Kolaborasi, Statistik, Webinar, Kategori, Pengguna, Log Aktivitas |
| **Grid kartu** radius 24, 2–4 per baris | Slide hero, Grup Komunitas, Pengurus |

### 8.2 Bilah alat (C-34) & aksi baris (C-39)

Urutan tetap di kanan kepala halaman: **Cari** (pil 280, `?q=`, debounce 250 ms, Escape mengosongkan) · **Saring** (tombol bulat + lencana jumlah, popover; `?kategori=`, `?status=`) · **Tambah** (pil hitam "+ Tambah …"; < 768: FAB bulat 56 kanan bawah, halaman diberi ruang bawah 112). Ekspor CSV **tidak dipakai** di PCI.

Aksi baris (kolom terakhir, rata kanan, tanpa judul terlihat): aksi khusus pil 13/500 (mis. "Tampilkan") → ✎ Ubah (bulat 36) → 🗑 Hapus (bulat 36, `--admin-danger`, hover `--admin-rose-soft`). `aria-label` berisi nama data ("Ubah FAQ Siapa aja yang boleh gabung?"). Urutkan: tombol bulat ↑ ↓ 36 (`aria-label` "Naikkan …"/"Turunkan …"), nonaktif di ujung daftar.

| Modul | Cari | Saring | Tambah | Ubah | Hapus | Urutkan | Aksi khusus |
|-------|------|--------|--------|------|-------|---------|-------------|
| Slide hero | — | — | ✓ dialog | ✓ dialog | ✓ | ✓ | Tampilkan/Sembunyikan |
| Statistik | — | — | ✓ dialog (≤ 4) | ✓ dialog | ✓ | ✓ | — |
| Kolaborasi, Kegiatan, Grup | ✓ | — | ✓ dialog | ✓ dialog | ✓ | ✓ | — |
| Pengurus, FAQ | ✓ | Tampil/Disembunyikan | ✓ dialog | ✓ dialog | ✓ | ✓ | Tampilkan/Sembunyikan |
| Webinar | ✓ | Kategori · Status · Waktu | ✓ halaman | ✓ halaman | ✓ | — (urut `starts_at`) | Tampilkan/Sembunyikan |
| Kategori (admin) | — | — | ✓ dialog | ✓ dialog | ✓ (ditolak bila dipakai) | ✓ | — |
| Pengguna (admin) | ✓ | Role · Status | ✓ "Undang" dialog | ✓ role dialog | ✓ | — | Aktifkan/Nonaktifkan |
| Log Aktivitas (admin) | ✓ | Modul · Pengguna | — | — | — | — | Lihat detail (T3) |

Hapus tampil untuk `editor` dan `admin` sesuai matriks ARCHITECTURE §9.3; RLS tetap membatasi.

### 8.3 Tabel (C-30)

| Unsur | Aturan |
|-------|--------|
| Wadah | Tanpa kartu, lebar penuh; gulir horizontal hanya di dalam wadah |
| Kepala | Latar `--admin-surface`, tinggi 48, sel pertama/terakhir radius 16, lengket; judul kolom 13/500 `--admin-text-secondary` huruf biasa |
| Baris | Min 64 (72 bila dua baris), garis bawah 1 px `--admin-line`, tanpa zebra/garis vertikal, hover `--admin-surface` |
| Sel | Padding 0 16 (pertama/terakhir 20). Identitas: baris 1 14/500, baris 2 13 `--admin-text-secondary` terpotong |
| Tanggal | 14 `--admin-text-secondary`, "4 Nov 2026, 19.00" WIB; < 24 jam relatif dengan `title` lengkap |
| Kosong | "—" `--admin-text-faint` |
| Status | `StatusChip` (§2.1): Tampil `mint` · Disembunyikan netral · Akan datang `mint` · Lewat netral · Perlu dilengkapi `peach` · Nonaktif `rose` · Role admin hitam · editor `lilac` |
| A11y | `<table>` asli, `<th scope="col">`, `<caption class="sr-only">` |

< 768 px (`stackOnMobile`): tiap baris jadi kartu `--admin-surface` radius 20, kolom pertama di atas + aksi kanan atas, lalu baris "label kiri · nilai kanan". Setiap `<td>` selain pertama & aksi wajib `data-label`.

### 8.4 Paginasi

20 per halaman (hanya Webinar, Pengguna, Log). "1–20 dari 46" kiri, tombol bulat ‹ › kanan. Daftar konten beranda (≤ 20 item) tanpa paginasi.

---

## 9. Memuat, kosong, galat

| Tunggu | Indikator |
|--------|-----------|
| < 300 ms | Tidak ada |
| Navigasi / muat pertama | Skeleton berbentuk isi akhir (`loading.tsx` per modul); blok `--admin-surface-muted` berujung bulat, 6 baris/kartu; kepala halaman tidak di-skeleton; `aria-busy` |
| Cari / saring | Isi lama redup 50% |
| Aksi tombol | Spinner di tombol |

**EmptyState (C-38):** kotak putus-putus radius 32 di tengah area `min(420px,55dvh)`, ikon 24 dalam bulatan 56, judul 16/500, satu kalimat 14. Varian: "Belum ada FAQ" + cara mengisi · "Tidak ada FAQ yang cocok" + "Coba kata kunci lain". Bilah alat tetap tampil.

| Galat | Tampilan |
|-------|----------|
| Field | Latar rose + pesan di bawah |
| Form / aksi | Banner rose di atas field pertama + **Coba lagi** |
| Daftar gagal dimuat | `error.tsx` per modul: "Daftar belum bisa dimuat." + **Coba lagi** |
| Sesi habis | Dialog "Sesi berakhir. Masuk lagi untuk melanjutkan." |
| Tanpa izin (editor ke route admin) | `notFound()` |

---

## 10. Umpan balik

| Komponen | Tampilan |
|----------|----------|
| Toast | Kapsul hitam tengah bawah, teks putih, ikon centang mint, 4 detik, `role="status"`. Hanya untuk sukses; galat tidak pakai toast |
| Tooltip | Pil hitam 13 px, tunda 400 ms |
| Dropdown / popover | Kartu putih radius 24, bayangan pop, butir pil 44 |
| Sakelar tampil | Optimistis; dikembalikan + banner bila server menolak |

---

## 11. Komponen

Path relatif `src/`. Kolom "Port dari" = file referensi Albana yang disalin lalu disesuaikan (role, token, Server Action PCI).

| ID | Komponen | Path | Port dari | Fitur |
|----|----------|------|-----------|-------|
| C-28 | `AdminShell` (header + kerangka + `RoleProvider`) | `features/admin/shell/admin-shell.tsx` | `components/admin/shell/AdminShell.tsx` | F-16 – F-19 |
| C-29 | `AdminSidebar` + `nav.ts` | `features/admin/shell/admin-sidebar.tsx`, `nav.ts` | `AdminShell.tsx`, `lib/admin-nav.ts` | F-16 – F-19 |
| C-30 | `DataTable` + `StatusChip` | `features/admin/ui/data-table.tsx` | `components/admin/ui/data-table.tsx` + `.admin-table` CSS | F-17, F-19 |
| C-31 | `SortButtons` (↑ ↓) | `features/admin/ui/sort-buttons.tsx` | — (baru) | F-17 |
| C-32 | `ImageUpload` | `features/admin/ui/image-upload.tsx` | Zona unggah di `partner/PartnerClient.tsx` | F-17 |
| C-33 | `DeleteDialog` | `features/admin/ui/delete-dialog.tsx` | `components/admin/ui/delete-sheet.tsx` | F-17, F-19 |
| C-34 | `TableToolbar` (Cari · Saring · Tambah) | `features/admin/ui/table-toolbar.tsx` | `components/admin/ui/table-toolbar.tsx` (tanpa Ekspor) | F-17, F-19 |
| C-35 | `AdminSheet` + `FormDialog` | `features/admin/ui/admin-sheet.tsx`, `form/form-dialog.tsx` | `components/admin/ui/AdminSheet.tsx`, `form/FormDialog.tsx` | F-16 – F-19 |
| C-36 | `FieldGrid`, `Field`, `FormSection`, `FormPage` | `features/admin/ui/form/fields.tsx` | `components/admin/ui/form/fields.tsx` | F-16 – F-19 |
| C-37 | `AdminInput`, `AdminTextarea`, `AdminSelect`, `CheckboxCard` | `features/admin/ui/form/controls.tsx` | `components/admin/ui/form/controls.tsx` (tanpa Price/Percent/Phone) | F-16 – F-19 |
| C-38 | `EmptyState` | `features/admin/ui/empty-state.tsx` | `components/admin/ui/empty-state.tsx` | F-17, F-19 |
| C-39 | `RowActions` | `features/admin/ui/row-actions.tsx` | `components/admin/ui/row-actions.tsx` (cek role `can()`) | F-17, F-19 |
| C-40 | `PageHeader` (`AdminPageTitle`, `AdminPageActions`) | `features/admin/shell/page-header.tsx` | `components/admin/PageHeader.tsx` | F-16 – F-19 |

Primitif di bawahnya (Dialog, Select, Checkbox, Label, DropdownMenu, Tooltip) dari **shadcn/ui** (kode disalin ke `components/ui/` via CLI, berbasis `radix-ui`), toast dari **`sonner`**. Keduanya dependency baru (§14).

---

## 12. Sampel CRUD satu halaman

Tiga pola yang menutupi semua modul PCI. Modul lain menyalin pola terdekat (§5.1). Semua mutasi mengikuti ARCHITECTURE §9.5: `requireStaff()` → zod → klien sesi (RLS) → `revalidateTag`.

### A. FAQ — tabel + dialog `md`, urutkan, tampil/sembunyi

Dipakai juga untuk: Kegiatan, Kolaborasi, Statistik, Kategori.

```
src/app/(admin)/admin/(cms)/faqs/page.tsx     # server: ambil data, render manager
src/app/(admin)/admin/(cms)/faqs/loading.tsx  # skeleton tabel 6 baris
src/features/admin/faqs/schema.ts             # zod = constraint T-11
src/features/admin/faqs/actions.ts            # save · remove · move · togglePublish
src/features/admin/faqs/faq-manager.tsx       # client: toolbar, tabel, dialog
src/lib/queries/admin/faqs.ts                 # listFaqs()
```

```ts
// features/admin/faqs/schema.ts
import { z } from "zod";
export const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(1, "Pertanyaan wajib diisi.").max(160, "Maksimal 160 karakter."),
  answer: z.string().trim().min(1, "Jawaban wajib diisi.").max(1000, "Maksimal 1000 karakter."),
  is_published: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
});
export type FaqInput = z.infer<typeof faqSchema>;
```

```ts
// features/admin/faqs/actions.ts
"use server";
import { revalidateTag } from "next/cache";
import { requireStaff } from "@/lib/auth/session";
import { createServerAuthClient } from "@/lib/supabase/server-auth";
import { fail, fromZod, type ActionResult } from "@/features/admin/ui/action-result";
import { faqSchema } from "./schema";

export async function saveFaq(formData: FormData): Promise<ActionResult> {
  await requireStaff();
  const parsed = faqSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);
  const { id, ...values } = parsed.data;
  const supabase = await createServerAuthClient();
  const { error } = id
    ? await supabase.from("faqs").update(values).eq("id", id)
    : await supabase.from("faqs").insert({ ...values, sort_order: await nextSortOrder(supabase, "faqs") });
  if (error) return fail(error);           // 23514 check · 42501 RLS → pesan Bahasa Indonesia
  revalidateTag("faqs");
  return { ok: true };
}

export async function removeFaq(id: string): Promise<ActionResult> {
  await requireStaff();
  const { error } = await (await createServerAuthClient()).from("faqs").delete().eq("id", id);
  if (error) return fail(error);
  revalidateTag("faqs");
  return { ok: true };
}

export async function moveFaq(id: string, direction: "up" | "down"): Promise<ActionResult> {
  await requireStaff();
  // shortcut: dua UPDATE terpisah (tanpa transaksi); cukup untuk ≤ 20 item & sedikit editor. Ganti RPC bila ada bentrok.
  const supabase = await createServerAuthClient();
  const { data: rows, error } = await supabase.from("faqs").select("id, sort_order").order("sort_order");
  if (error) return fail(error);
  const i = rows.findIndex((r) => r.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  const a = rows[i], b = rows[j];
  if (!a || !b) return { ok: true };
  await supabase.from("faqs").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("faqs").update({ sort_order: a.sort_order }).eq("id", b.id);
  revalidateTag("faqs");
  return { ok: true };
}

export async function toggleFaq(id: string, is_published: boolean): Promise<ActionResult> {
  await requireStaff();
  const { error } = await (await createServerAuthClient()).from("faqs").update({ is_published }).eq("id", id);
  if (error) return fail(error);
  revalidateTag("faqs");
  return { ok: true };
}
```

```tsx
// app/(admin)/admin/(cms)/faqs/page.tsx
import { listFaqs } from "@/lib/queries/admin/faqs";
import { FaqManager } from "@/features/admin/faqs/faq-manager";

export default async function FaqsPage() {
  return <FaqManager faqs={await listFaqs()} />; // layout (cms) sudah requireStaff()
}
```

```tsx
// features/admin/faqs/faq-manager.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleHelp } from "lucide-react";
import { toast } from "sonner";
import { TableToolbar, matchesQuery } from "@/features/admin/ui/table-toolbar";
import { DataTable, StatusChip } from "@/features/admin/ui/data-table";
import { RowActions, rowPillClass } from "@/features/admin/ui/row-actions";
import { SortButtons } from "@/features/admin/ui/sort-buttons";
import { EmptyState } from "@/features/admin/ui/empty-state";
import { FormDialog } from "@/features/admin/ui/form/form-dialog";
import { Field, FieldGrid } from "@/features/admin/ui/form/fields";
import { AdminInput, AdminTextarea, CheckboxCard } from "@/features/admin/ui/form/controls";
import type { FaqRow } from "@/lib/queries/admin/faqs";
import { moveFaq, removeFaq, saveFaq, toggleFaq } from "./actions";

export function FaqManager({ faqs }: { faqs: FaqRow[] }) {
  const router = useRouter();
  const query = useSearchParams().get("q") ?? "";
  const [editing, setEditing] = useState<FaqRow | "new" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const visible = faqs.filter((f) => matchesQuery(`${f.question} ${f.answer}`, query));
  const current = editing === "new" ? null : editing;

  function run(task: () => Promise<{ ok: boolean; message?: string }>, success?: string) {
    startTransition(async () => {
      const res = await task();
      if (!res.ok) return void toast.error(res.message ?? "Perubahan gagal disimpan.");
      if (success) toast.success(success);
      router.refresh();
    });
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (current) data.set("id", current.id);
    startTransition(async () => {
      const res = await saveFaq(data);
      if (!res.ok) { setErrors(res.fieldErrors ?? {}); setFormError(res.fieldErrors ? null : res.message); return; }
      setEditing(null);
      toast.success(current ? "FAQ diperbarui." : "FAQ ditambahkan.");
      router.refresh();
    });
  }

  return <div className="space-y-6">
    <TableToolbar search={{ placeholder: "Cari FAQ…" }} create={{ label: "Tambah FAQ", onClick: () => { setErrors({}); setFormError(null); setEditing("new"); } }} />

    {visible.length === 0
      ? <EmptyState searching={!!query} title={query ? "Tidak ada FAQ yang cocok" : "Belum ada FAQ"}
          description={query ? "Coba kata kunci lain." : "Tambahkan pertanyaan yang sering ditanyakan calon anggota."} />
      : <DataTable caption="FAQ" stackOnMobile>
          <thead><tr><th scope="col">Pertanyaan</th><th scope="col">Status</th><th scope="col">Urutan</th><th scope="col"><span className="sr-only">Aksi</span></th></tr></thead>
          <tbody>{visible.map((faq, i) => <tr key={faq.id}>
            <td><p className="font-medium">{faq.question}</p><p className="truncate text-[13px] text-admin-text-secondary">{faq.answer}</p></td>
            <td data-label="Status">{faq.is_published ? <StatusChip tone="mint">Tampil</StatusChip> : <StatusChip tone="neutral">Disembunyikan</StatusChip>}</td>
            <td data-label="Urutan"><SortButtons itemName={faq.question} disabled={!!query || pending}
              first={i === 0} last={i === visible.length - 1}
              onMove={(dir) => run(() => moveFaq(faq.id, dir))} /></td>
            <td><RowActions itemName={`FAQ ${faq.question}`}
              extra={<button type="button" className={rowPillClass} onClick={() => run(() => toggleFaq(faq.id, !faq.is_published), faq.is_published ? "FAQ disembunyikan." : "FAQ ditampilkan.")}>
                {faq.is_published ? "Sembunyikan" : "Tampilkan"}</button>}
              onEdit={() => { setErrors({}); setFormError(null); setEditing(faq); }}
              onDelete={async () => { const res = await removeFaq(faq.id); if (!res.ok) return { error: res.message }; router.refresh(); }} /></td>
          </tr>)}</tbody>
        </DataTable>}

    <FormDialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}
      icon={<CircleHelp aria-hidden size={20} strokeWidth={1.5} />}
      title={current ? "Ubah FAQ" : "Tambah FAQ"} description="Pertanyaan tampil di section FAQ beranda."
      size="md" submitLabel="Simpan FAQ" pending={pending} onSubmit={submit}>
      {formError && <p role="alert" className="mb-5 rounded-[20px] bg-admin-rose-soft px-4 py-3 text-[13px] text-admin-rose-ink">{formError}</p>}
      <FieldGrid columns={1}>
        <Field label="Pertanyaan" htmlFor="faq-question" required error={errors.question}>
          <AdminInput id="faq-question" name="question" maxLength={160} defaultValue={current?.question} aria-invalid={!!errors.question} required />
        </Field>
        <Field label="Jawaban" htmlFor="faq-answer" required error={errors.answer} hint="Maksimal 1000 karakter.">
          <AdminTextarea id="faq-answer" name="answer" maxLength={1000} rows={5} defaultValue={current?.answer} aria-invalid={!!errors.answer} required />
        </Field>
        <CheckboxCard id="faq-published" name="is_published" tone="mint" defaultChecked={current?.is_published ?? true}
          title="Tampilkan di situs" description="Matikan untuk menyimpan sebagai draf." />
      </FieldGrid>
    </FormDialog>
  </div>;
}
```

Urutkan dinonaktifkan saat pencarian aktif (urutan hasil cari ≠ urutan asli).

### B. Pengurus — grid kartu + dialog `lg` dengan unggah foto

Dipakai juga untuk: Grup Komunitas (logo bulat), Slide hero (gambar + alt + caption).

```text
╭────────────────────────╮ ╭────────────────────────╮ ╭────────────────────────╮
│ ╭────────────────────╮ │ │ ╭────────────────────╮ │ │  (+)                    │
│ │   foto 282:310     │ │ │ │                    │ │ │  Tambah pengurus        │ ← kartu putus-putus (opsional; FAB di ponsel)
│ │           (✎) (🗑) │ │ │ │                    │ │ │                         │
│ ╰────────────────────╯ │ │ ╰────────────────────╯ │ ╰────────────────────────╯
│ Farhan Muhamad S       │ │ Andrian Cahyanto       │
│ Founder    • Tampil    │ │ Co-Founder  • Tampil   │
│ (↑)(↓)   (Sembunyikan) │ │ (↑)(↓)   (Sembunyikan) │
╰────────────────────────╯ ╰────────────────────────╯
```

- Grid 1/2/3/4 kolom (`base`/`sm`/`lg`/`xl`), kartu `--admin-surface` radius 24, tepi `--admin-line`. Foto `next/image` dari `publicUrl(photo_path)`. ✎ & 🗑 bulat 36 di pojok foto (latar `--admin-canvas`/90).
- Dialog `lg`, dua kolom: kiri `ImageUpload` (rasio 282:310), kanan Nama*, Peran*, URL LinkedIn (`type="url"`, petunjuk "Diawali https://"), `CheckboxCard` Tampil.

```ts
// features/admin/team/actions.ts (inti)
export async function saveTeamMember(formData: FormData): Promise<ActionResult> {
  await requireStaff();
  const parsed = teamMemberSchema.safeParse(Object.fromEntries(formData)); // photo: z.instanceof(File).optional()
  if (!parsed.success) return fromZod(parsed.error);
  const { id, photo, ...values } = parsed.data;
  if (!id && !photo) return { ok: false, code: "invalid", fieldErrors: { photo: "Foto wajib diunggah." } };
  const supabase = await createServerAuthClient();
  const newPath = photo ? await uploadImage(supabase, "team", photo) : undefined; // validasi MIME & ≤ 2 MB, nama uuid
  const oldPath = id && newPath ? await currentPath(supabase, "team_members", "photo_path", id) : null;
  const { error } = id
    ? await supabase.from("team_members").update({ ...values, ...(newPath && { photo_path: newPath }) }).eq("id", id)
    : await supabase.from("team_members").insert({ ...values, photo_path: newPath!, sort_order: await nextSortOrder(supabase, "team_members") });
  if (error) { if (newPath) await removeImage(supabase, newPath); return fail(error); }
  if (oldPath) await removeImage(supabase, oldPath); // objek lama dihapus setelah baris tersimpan
  revalidateTag("team_members");
  return { ok: true };
}
```

`next.config.ts`: `experimental.serverActions.bodySizeLimit = "3mb"` agar file 2 MB + field muat.

### C. Link & Sosial Media — satu kartu form (T2 ringkas), hanya admin

```text
Pengaturan ⟶ Link & Sosial Media
Link & Sosial Media                                  ● Belum tersimpan  (Batal) (■ Simpan perubahan)
Link WhatsApp, Instagram, dan LinkedIn di seluruh situs.

╭─ kartu putih · radius 28 · padding 40 · max-w 760 ───────────────╮
│ (1) KANAL KOMUNITAS                                               │
│ ───────────────────────────────────────────────────────────────── │
│ Link grup WhatsApp *                                              │
│ ( https://chat.whatsapp.com/…                                )    │
│ Dipakai tombol "Gabung Grup WhatsApp" di hero, CTA, dan menu.     │
│ ───────────────────────────────────────────────────────────────── │
│ (2) SOSIAL MEDIA                                                  │
│ URL Instagram *                    Handle Instagram *             │
│ ( https://www.instagram.com/… )    ( @productcommunityid      )   │
│ URL LinkedIn *                                                    │
│ ( https://www.linkedin.com/company/…                          )   │
╰───────────────────────────────────────────────────────────────────╯
```

```ts
// features/admin/settings/actions.ts (inti)
export async function saveSiteLinks(formData: FormData): Promise<ActionResult> {
  await requireAdmin();                                   // editor → notFound di halaman; RLS menolak di DB
  const parsed = siteLinksSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fromZod(parsed.error);
  const supabase = await createServerAuthClient();
  const rows = Object.entries(parsed.data).map(([key, value]) => ({ key, value }));
  const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) return fail(error);
  revalidateTag("site_settings");
  return { ok: true };
}
```

Form memakai `FormPage width="single"` + dua `FormSection`, bilah simpan §7.5. Upsert hanya 4 key yang lolos `check (key in …)`; RLS T-01 hanya mengizinkan admin (UPDATE). Karena upsert butuh INSERT, policy admin T-01 = `insert` + `update` dengan `with check (private.is_admin())`.

---

## 13. Daftar periksa per layar

- [ ] Hijau brand hanya di logo; satu kartu sorotan hitam maksimum; `butter` ≤ 3 unsur.
- [ ] Plus Jakarta Sans; judul 400; input 16 px di < 768.
- [ ] Tombol ikon bulat; tombol teks & input pil; tombol ikon punya `aria-label`.
- [ ] Kepala halaman dari shell; deskripsi dari `nav.ts`.
- [ ] Menu & aksi mengikuti role (`can()`); route admin-only → `notFound()` untuk editor.
- [ ] Dialog: fokus awal, Escape, fokus kembali, tidak tertutup diam-diam saat ada perubahan.
- [ ] Galat field inline, galat umum banner, sukses toast.
- [ ] Tabel jadi kartu di < 768; tanpa scroll horizontal di 360.
- [ ] Reduced motion; kontras teks ≥ 4.5:1; fokus terlihat di tema terang & gelap.
- [ ] Diuji 360 / 768 / 1280, zoom 200%, keyboard saja.

## 14. Dependency CMS (butuh persetujuan, AGENTS §7.1)

| Paket | Alasan | Alternatif tanpa dependency |
|-------|--------|-----------------------------|
| `@supabase/ssr` | Sesi cookie untuk Server Component, Server Action, `proxy.ts` | Tidak praktis; menulis ulang manajemen cookie Supabase Auth |
| `radix-ui` (+ kode shadcn: dialog, select, checkbox, label, dropdown-menu, tooltip) | Kit referensi dibangun di atasnya; fokus trap, portal, ARIA select sudah benar | `<dialog>` native + `<select>` native: lebih ringan, tapi select tidak bisa digayakan seperti referensi |
| `sonner` | Toast referensi | Live region + komponen toast sendiri (~60 baris) |

Semua hanya di-import dari `src/app/(admin)` dan `src/features/admin`, sehingga bundle situs publik tidak berubah.
