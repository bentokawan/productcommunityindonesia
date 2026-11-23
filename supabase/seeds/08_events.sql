insert into public.events (
  slug,
  category_id,
  edition_label,
  title,
  speakers,
  poster_path,
  starts_at,
  instagram_url,
  is_published
)
select
  v.slug,
  c.id,
  v.edition_label,
  v.title,
  v.speakers,
  v.poster_path,
  v.starts_at::timestamptz,
  v.instagram_url,
  true
from (
  values
    (
      'riung-class-1-building-a-product-with-purpose',
      'riung-class',
      'Riung Class #1',
      'Building a Product with Purpose',
      'Hadian Rahmat · Founder nawaetu.com',
      'placeholders/webinar-1.svg',
      '2026-11-04T19:00:00+07:00',
      'https://www.instagram.com/productcommunityid/'
    ),
    (
      'sharing-session-7-semua-akan-outsource-pada-waktunya',
      'sharing-session',
      '#SharingSession7',
      'Semua Akan Outsource Pada Waktunya',
      'Ardi Dwi Passusanto & Irma Suryaningsih · Kitahire Indonesia',
      'placeholders/webinar-2.svg',
      '2026-10-14T19:00:00+07:00',
      'https://www.instagram.com/productcommunityid/'
    ),
    (
      'sharing-session-6-belajar-coding-tanpa-resep',
      'sharing-session',
      '#SharingSession6',
      'Belajar Coding Tanpa Resep, Siapa Tau Jadi Punya Resep Sendiri',
      'Gilang Bintang · Head of AI Product, Verita Informatika',
      'placeholders/webinar-3.svg',
      '2026-09-23T19:00:00+07:00',
      'https://www.instagram.com/productcommunityid/'
    ),
    (
      'sharing-session-5-udah-kabur-duluan',
      'sharing-session',
      '#SharingSession5',
      '#UdahKaburDuluan',
      'Razi Abraham & Dimas Wicaksono',
      'placeholders/webinar-4.svg',
      '2026-08-26T19:00:00+07:00',
      'https://www.instagram.com/productcommunityid/'
    ),
    (
      'sharing-pm-4-peran-product-menjaga-harmoni-gunung-olympus',
      'sharing-session',
      '#SharingPM4',
      'Peran Product Menjaga Harmoni Gunung Olympus',
      'Mark Swapo · Senior AVP Product, BCA Digital',
      'placeholders/webinar-5.svg',
      '2026-07-15T19:00:00+07:00',
      'https://www.instagram.com/productcommunityid/'
    ),
    (
      'sharing-pm-3-you-ex-designer-mau-jadi-pm-bisa',
      'sharing-session',
      '#SharingPM3',
      'You Ex-Designer Mau Jadi PM? Bisa?',
      'Hafidz Noor · Product Manager, DOKU',
      'placeholders/webinar-6.svg',
      '2026-06-18T19:00:00+07:00',
      'https://www.instagram.com/productcommunityid/'
    )
) as v(slug, category_slug, edition_label, title, speakers, poster_path, starts_at, instagram_url)
join public.event_categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
