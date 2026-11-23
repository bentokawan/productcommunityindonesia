insert into public.activities (emoji, title, description, sort_order)
select v.emoji, v.title, v.description, v.sort_order
from (
  values
    ('🎙️', 'Sharing Session', 'Webinar rutin bareng praktisi product, terbuka untuk umum.', 1),
    ('💬', 'Diskusi Grup', 'Tanya jawab dan ngobrol santai seputar product di grup komunitas.', 2),
    ('🤝', 'Kolaborasi', 'Bagi-bagi project dan kerja bareng sesama member lintas perusahaan.', 3),
    ('📍', 'Gathering & Event', 'Ketemu langsung di event offline dan acara bareng partner komunitas.', 4)
) as v(emoji, title, description, sort_order)
where not exists (
  select 1 from public.activities a where a.title = v.title
);
