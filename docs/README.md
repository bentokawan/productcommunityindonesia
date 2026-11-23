# Dokumentasi — Product Community Indonesia (PCI)

| Dokumen | Isi |
|---------|-----|
| [PRD.md](PRD.md) | Tujuan, persona, user flow, functional requirements (`F-xx`), copy final, matriks keterlacakan |
| [design/design-web.md](design/design-web.md) | Situs publik (dari Figma): token, komponen `C-01` – `C-27`, layout per breakpoint |
| [design/design-admin.md](design/design-admin.md) | CMS `/admin` (dari desain admin Albana Speech Academy): token `--admin-*`, kerangka, templat, komponen `C-28` – `C-40`, sampel CRUD |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Struktur folder (app + SQL), skema data (`T-xx`), RLS per role, data flow, CMS `/admin` (modul, navigasi, izin) |
| [AGENTS.md](AGENTS.md) | Coding standards, konvensi, guardrails untuk AI coding agent |
| [plan/](plan/) | Rencana eksekusi, format `YYYY-MM-DD-<nama>.md` |

## Sistem ID lintas dokumen

- `F-xx` fitur (PRD) → `C-xx` komponen (design-web / design-admin) → `T-xx` tabel (ARCHITECTURE).
- Matriks lengkap ada di [PRD §7](PRD.md#7-matriks-keterlacakan). Perubahan satu ID wajib memperbarui ketiga dokumen.

## Sumber desain

- CMS: pola admin Albana Speech Academy (`albanaspeechacademy/docs/albana-docs/design/admin-ui-patterns.md` + `front/components/admin/ui`). Ringkasan & adaptasi di [design/design-admin.md](design/design-admin.md).

- Figma: `https://www.figma.com/design/SHwk8txsKDV19XXgaBqiGk/productcommunityindonesia?node-id=1-23`
- Frame: Desktop 1440 `1:24` · Tablet 768 `1:288` · Mobile 390 `1:550` · Menu Open `1:781`
- Diekstrak 2026-11-23 lewat Figma MCP (metadata + design context desktop). File tidak memakai Variables, jadi token dinormalisasi dari nilai literal.
