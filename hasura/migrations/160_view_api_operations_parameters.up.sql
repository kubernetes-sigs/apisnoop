-- api_operations_parameters view
--    This only gives us 17 distinct parameters, but 4k rows.  It looks like the same parameters are used again and again across the operation_ids.  
--    All of them have a description except for the param 'body in body'.  Need to look further into what that param looks like
-- #+NAME: api_operations_parameters view

CREATE OR REPLACE VIEW "public"."api_operations_parameters" AS 
  SELECT (param.entry ->> 'name'::text) AS name,
         (param.entry ->> 'in'::text) AS "in",
         replace(
           CASE
           WHEN ((param.entry ->> 'in'::text) = 'body'::text) 
            AND ((param.entry -> 'schema'::text) is not null)
             THEN ((param.entry -> 'schema'::text) ->> '$ref'::text)
           ELSE (param.entry ->> 'type'::text)
           END, '#/definitions/','') AS resource,
         (param.entry ->> 'description'::text) AS description,
         CASE
         WHEN ((param.entry ->> 'required'::text) = 'true') THEN true
         ELSE false
          END AS required,
         CASE
         WHEN ((param.entry ->> 'uniqueItems'::text) = 'true') THEN true
         ELSE false
         END AS unique_items,
         api_operations.raw_swagger_id,
         param.entry as entry
    FROM api_operations
         , jsonb_array_elements(api_operations.parameters) WITH ORDINALITY param(entry, index)
          WHERE api_operations.parameters IS NOT NULL;
