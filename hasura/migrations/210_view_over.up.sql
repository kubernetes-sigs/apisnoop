-- Create Over View
-- #+NAME: over view

-- drop materialized view api_resources CASCADE;
-- CREATE MATERIALIZED VIEW "public"."api_resources" AS
CREATE OR REPLACE VIEW "public"."over" AS
 SELECT
    -- JOIN raw_swaggers.id = o.raw_swagger_id
    -- JOIN raw_swaggers.id = r.raw_swagger_id
    -- JOIN o.id = op.api_operation_id
    -- JOIN r.id = rf.type_id
    -- where raw_swagger.id = 2 -- for now
    -- where raw_swagger.branch_or_tag = 'release-1.14' -- eventually
    o.operation_id,
    op.name as opname,
    op.required,
    -- op.unique,
    op.description as opdescription,
    --or.code, -- links via .resources
    --or.resource, -- links via .resources
   ---- JOIN op.name ==
    r.name as rname,
    r.k8s_group,
    r.k8s_version,
    r.k8s_kind,
    rf.property,
    rf.param_type,
    rf.param_kind,
    rf.description,
    rf.format,
    rf.merge_key,
    rf.patch_strategy
   FROM raw_swaggers rs,
     api_operations o,
     api_operations_parameters op,
     api_operations_responses resp,
     api_resources r,
     api_resources_fields rf
   WHERE rs.id = o.raw_swagger_id
     AND rs.id = r.raw_swagger_id
     AND o.id = op.api_operations_id
     AND r.id = rf.type_id
     -- AND rs.id = 1
  ORDER BY operation_id;
