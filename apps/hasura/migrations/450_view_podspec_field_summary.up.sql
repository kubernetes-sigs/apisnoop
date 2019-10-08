-- 450: PodSpec Field Summary View
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/450_view_podspec_field_summary.up.sql
--    :END:
-- #+NAME: view podspec_field_summary

create view podspec_field_summary as
  select distinct field_name as podspec_field,
                  0 as other_hits,
                  0 as e2e_hits,
                  0 as conf_hits,
                  bucket,
                  job
    from api_schema_field
   where field_schema like '%PodSpec%'
   UNION
  select
    podspec_field,
    sum(hits) as other_hits,
    0 as e2e_hits,
    0 as conf_hits,
    bucket,
    job
    from podspec_field_coverage
   where useragent not like 'e2e.test%'
   group by podspec_field, bucket, job
   UNION
  select
    podspec_field,
    0 as other_hits,
    sum(hits) as e2e_hits,
    0 as conf_hits,
    bucket,
    job
    from podspec_field_coverage
   where useragent like 'e2e.test%'
     and test not like '%Conformance%'
   group by podspec_field, bucket, job
   UNION
  select
    podspec_field,
    0 as other_hits,
    0 as e2e_hits,
    sum(hits) as conf_hits,
    bucket,
    job
    from podspec_field_coverage
   where useragent like 'e2e.test%'
     and test like '%Conformance%'
   group by podspec_field, bucket, job;
