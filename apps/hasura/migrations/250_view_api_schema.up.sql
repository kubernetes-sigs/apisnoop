-- Create

--  #+NAME: api_schema view

CREATE OR REPLACE VIEW "public"."api_schema" AS 
 SELECT 
    bjs.bucket,
    bjs.job,
    d.key AS schema_name,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'kind'::text) AS k8s_kind,
    (d.value ->> 'type'::text) AS resource_type,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'version'::text) AS k8s_version,
    (((d.value -> 'x-kubernetes-group-version-kind'::text) -> 0) ->> 'group'::text) AS k8s_group,
    ARRAY(SELECT jsonb_array_elements_text(d.value -> 'required')) as required_fields,
    (d.value -> 'properties'::text) AS properties,
    d.value
   FROM bucket_job_swagger bjs
     , jsonb_each((bjs.swagger -> 'definitions'::text)) d(key, value)
   GROUP BY bjs.bucket, bjs.job, d.key, d.value;
