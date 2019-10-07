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
