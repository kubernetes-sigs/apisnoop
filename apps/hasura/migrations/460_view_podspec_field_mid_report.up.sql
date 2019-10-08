-- 460: PodSpec Field mid Report View
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/460_view_podspec_field_mid_report.up.sql
--    :END:
--  #+NAME: podspec_field_mid_report

create or replace view podspec_field_mid_report as
select distinct podspec_field,
      sum(other_hits) as other_hits,
      sum(e2e_hits) as e2e_hits,
      sum(conf_hits) as conf_hits,
      kfp.release,
      kfp.deprecated,
      kfp.gated,
      kfp.required,
      kfp.field_kind,
      kfp.field_type,
      pfs.bucket, 
      pfs.job
from podspec_field_summary pfs, kind_field_path_recursion kfp
where 
  kfp.kind = 'io.k8s.api.core.v1.PodSpec'
  and pfs.podspec_field = kfp.field_path
group by podspec_field, kfp.release, kfp.deprecated, kfp.gated, kfp.required, kfp.field_kind, kfp.field_type, pfs.bucket, pfs.job
order by conf_hits, e2e_hits, other_hits;
