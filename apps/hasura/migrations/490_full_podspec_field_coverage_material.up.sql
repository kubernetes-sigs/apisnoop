-- 490: materialized full_podspec_field_coverage
--    :PROPERTIES:
--    :header-args:sql-mode+: :tangle ../apps/hasura/migrations/490_full_podspec_field_coverage_material.up.sql
--    :END:
--    We want a subset of this grand field_coverage view, looking only for fields that come from Podspec.    
--    This is going to look across all our buckets and jobs, so it will take a bit of time to materialize.
   
--    We are only looking at the stable, core kinds or the GA kinds.
   
--    #+NAME: full_podspec_field_coverage_material

CREATE MATERIALIZED VIEW "public"."full_podspec_field_coverage_material" AS
  WITH podspec_kinds AS (
        SELECT DISTINCT kind, field_path
          FROM kind_field_path_coverage
           WHERE field_kind = 'io.k8s.api.core.v1.PodSpec'
           AND kind not like '%alpha%'
           AND kind not like '%beta%'
           AND operation_id is not null
  )
  SELECT DISTINCT
    trim(leading 'io.k8s.api.' from c.kind) as kind,
    trim(leading 'io.k8s.api.' from c.sub_kind) as  sub_kind,
    c.field_path,
    distance,
    count(*) FILTER(WHERE c.useragent like 'e2e.test%') as test_hits,
    count(*) FILTER(WHERE c.useragent like '%[Conformance]%') as conf_hits,
    c.field_kind
    FROM kind_field_path_coverage c
      INNER JOIN podspec_kinds pk ON (c.kind = pk.kind AND c.field_path like  pk.field_path || '%')
      and sub_kind not like '%VolumeSource'
      GROUP BY c.sub_kind, c.kind, c.field_path, c.field_kind, c.distance, pk.field_path
      ORDER BY field_path;
