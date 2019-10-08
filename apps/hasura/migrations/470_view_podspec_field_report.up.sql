-- 470: PodSpec Field Report View
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/470_view_podspec_field_report.up.sql
--    :END:
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
      field_type,
      bucket,
      job
from podspec_field_mid_report
group by podspec_field, release, deprecated, gated, required, field_kind, field_type, bucket, job
order by conf_hits, e2e_hits, other_hits;

select
  podspec_field, e2e_hits, pfr.job, bjs.job_timestamp
  from podspec_field_report pfr
  JOIN bucket_job_swagger bjs on(bjs.bucket = pfr.bucket AND bjs.job = pfr.job) 
 order by podspec_field;
