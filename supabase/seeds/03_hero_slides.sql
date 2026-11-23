insert into public.hero_slides (image_path, alt, caption, caption_long, sort_order, is_published)
select v.image_path, v.alt, v.caption, v.caption_long, v.sort_order, v.is_published
from (
  values
    ('placeholders/slide-1.svg', 'Kolaborasi Product Community Indonesia bersama Indonesia Product Conference 2026', 'PCI × IPC 2026', 'PCI × INDONESIA PRODUCT CONFERENCE 2026', 1, true),
    ('placeholders/slide-2.svg', 'Sesi Sharing Session bersama praktisi product digital Indonesia', 'Sharing Session #7', 'SHARING SESSION BERSAMA PRAKTISI PRODUCT', 2, true),
    ('placeholders/slide-3.svg', 'Kelas praktik Riung Class bersama Product Community Indonesia', 'Riung Class #1', 'RIUNG CLASS · PRAKTIK PRODUCT LANGSUNG', 3, true),
    ('placeholders/slide-4.svg', 'Gathering dan diskusi santai komunitas Product Community Indonesia', 'Community Meetup', 'GATHERING & NETWORKING KOMUNITAS PCI', 4, true)
) as v(image_path, alt, caption, caption_long, sort_order, is_published)
where not exists (
  select 1 from public.hero_slides h where h.caption = v.caption
);
