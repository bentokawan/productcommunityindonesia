insert into public.faqs (question, answer, sort_order, is_published)
select v.question, v.answer, v.sort_order, true
from (
  values
    (
      'Apakah gabung komunitas PCI berbayar?',
      'Gabung grup komunitasnya gratis dan terbuka untuk umum. Sebagian besar Sharing Session juga gratis, tapi ada beberapa program atau kelas kolaborasi yang berbayar. Info biayanya selalu ditulis jelas di poster.',
      1
    ),
    (
      'Siapa aja yang boleh gabung?',
      'Siapa aja yang tertarik sama dunia product digital. Mulai dari PM, PO, product analyst, designer, engineer, sampai mahasiswa atau kamu yang lagi mau pindah karier ke product. Mau masih belajar atau udah praktisi, semuanya welcome.',
      2
    ),
    (
      'Apa aja kegiatan di dalam komunitas?',
      'Ada Sharing Session rutin bareng praktisi product, diskusi santai di grup WhatsApp, kolaborasi dan bagi-bagi project, sampai gathering di event offline bareng partner. Kamu juga bisa masuk ke grup Job Akses, Akses Belajar, Bagi-Bagi Project, dan Forum Jual Beli.',
      3
    ),
    (
      'Gimana cara ikut webinar-nya?',
      'Pantengin info webinar di grup WhatsApp atau Instagram @productcommunityid. Daftar lewat link yang ada di poster, nanti link Zoom atau Google Meet-nya dikirim sebelum acara mulai.',
      4
    )
) as v(question, answer, sort_order)
where not exists (
  select 1 from public.faqs f where f.question = v.question
);
