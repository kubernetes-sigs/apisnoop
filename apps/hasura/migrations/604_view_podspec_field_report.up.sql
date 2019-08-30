-- 604: PodSpec Field Review View
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/604_view_podspec_field_report.up.sql
--   :END:
-- #+NAME: podspec_field_hits

create or replace view podspec_field_report as
select distinct podspec_field,
      sum(other_hits) as other_hits,
      sum(e2e_hits) as e2e_hits,
      sum(conf_hits) as conf_hits,
      kfp.release,
      kfp.deprecated,
      kfp.gated,
      kfp.required
from podspec_field_summary pfs, kind_field_path kfp
where kfp.field_type not like 'io%'
  and kfp.kind like '%PodSpec'
  and kfp.sub_kind like '%PodSpec'
  and pfs.podspec_field = regexp_replace(kfp.field_path, '.*\.','') 
group by podspec_field, kfp.release, kfp.deprecated, kfp.gated, kfp.required
order by conf_hits, e2e_hits, other_hits;
