insert into public.team_members (name, role, photo_path, linkedin_url, sort_order, is_published)
select v.name, v.role, v.photo_path, v.linkedin_url, v.sort_order, true
from (
  values
    ('Farhan Muhamad S', 'Founder', 'placeholders/team-1.svg', 'https://www.linkedin.com/company/productcommunityid/', 1),
    ('Andrian Cahyanto', 'Co-Founder', 'placeholders/team-2.svg', 'https://www.linkedin.com/company/productcommunityid/', 2),
    ('Gilang Marhadian', 'Co-Founder', 'placeholders/team-3.svg', 'https://www.linkedin.com/company/productcommunityid/', 3),
    ('Ristina Nur', 'Community Partnership', 'placeholders/team-4.svg', 'https://www.linkedin.com/company/productcommunityid/', 4)
) as v(name, role, photo_path, linkedin_url, sort_order)
where not exists (
  select 1 from public.team_members t where t.name = v.name
);
