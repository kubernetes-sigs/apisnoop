-- 604: PodSpec Field mid Report View
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/604_view_podspec_field_report.up.sql
--   :END:
-- #+NAME: podspec_field_hits

create or replace view podspec_field_mid_report as
select distinct
  field_name as podspec_field,
  0 as other_hits,
  0 as e2e_hits,
  0 as conf_hits,
  release,
  deprecated,
  feature_gated as gated,
  required,
  field_kind,
  field_type
  from api_schema_field
 where field_schema like '%PodSpec%'
 UNION
select distinct podspec_field,
      sum(other_hits) as other_hits,
      sum(e2e_hits) as e2e_hits,
      sum(conf_hits) as conf_hits,
      kfp.release,
      kfp.deprecated,
      kfp.gated,
      kfp.required,
      kfp.field_kind,
      kfp.field_type
from podspec_field_summary pfs, kind_field_path kfp
where kfp.field_type not like 'io%'
  and (kfp.kind like '%PodSpec'
  or kfp.sub_kind like '%PodSpec')
  and pfs.podspec_field = regexp_replace(kfp.field_path, '.*\.','') 
group by podspec_field, kfp.release, kfp.deprecated, kfp.gated, kfp.required, kfp.field_kind, kfp.field_type
order by conf_hits, e2e_hits, other_hits;

-- 604: PodSpec Field Report View
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/604_view_podspec_field_report.up.sql
--   :END:
-- #+NAME: podspec_field_hits

create or replace view podspec_field_report as
select distinct podspec_field,
      sum(other_hits) as other_hits,
      sum(e2e_hits) as e2e_hits,
      sum(conf_hits) as conf_hits,
      release,
      deprecated,
      gated,
      required,
      field_kind,
      field_type
from podspec_field_mid_report
group by podspec_field, release, deprecated, gated, required, field_kind, field_type
order by conf_hits, e2e_hits, other_hits;
