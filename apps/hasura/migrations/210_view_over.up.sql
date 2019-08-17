-- Create
--  #+NAME: over view

CREATE OR REPLACE VIEW "public"."over" AS
  SELECT
    op.name as param_name,
    op.required as param_required,
    op.description as param_description,
    o.operation_id,
    op.resource,
    r.name as resource_name,
    r.k8s_group,
    r.k8s_version,
    r.k8s_kind,
    rf.resource_field,
    rf.param_type,
    rf.param_kind,
    rf.description,
    rf.format,
    rf.merge_key,
    rf.patch_strategy
    FROM
        api_operation_parameter op
        JOIN api_operation o ON (
          o.raw_swagger_id = op.raw_swagger_id
          AND
          o.operation_id = op.operation_id
        )
        LEFT JOIN api_schema r ON (
          op.resource = r.name
          AND
          op.raw_swagger_id = r.raw_swagger_id
          )
        LEFT JOIN api_schema_field rf ON (
          rf.api_resource_name = r.name
          AND
          rf.raw_swagger_id = r.raw_swagger_id
        )
   ORDER BY op.name;
