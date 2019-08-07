-- Create Over View
-- #+NAME: over view

CREATE OR REPLACE VIEW "public"."over" AS
  SELECT
    op.name as opname,
    op.required,
    op.description as opdescription,
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
        api_operations_parameters op
        JOIN api_operations o ON (
          o.raw_swagger_id = op.raw_swagger_id
          AND
          o.operation_id = op.operation_id
        )
        LEFT JOIN api_resources r ON (
          op.resource = r.name
          AND
          op.raw_swagger_id = r.raw_swagger_id
          )
        LEFT JOIN api_resources_fields rf ON (
          rf.api_resource_name = r.name
          AND
          rf.raw_swagger_id = r.raw_swagger_id
        )
   ORDER BY op.name;
