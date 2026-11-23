insert into public.site_stats (value, label, sort_order)
select v.value, v.label, v.sort_order
from (
  values
    ('8+', 'webinar sejak Mei 2025', 1),
    ('1000+', 'member di grup komunitas', 2)
) as v(value, label, sort_order)
where not exists (
  select 1 from public.site_stats s where s.label = v.label
);
