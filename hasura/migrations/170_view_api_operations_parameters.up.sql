-- api_operations real view

-- #+NAME: api_operations_parameters view

-- DROP VIEW api_operations_parameters;
CREATE OR REPLACE VIEW "public"."api_operations_parameters" AS 
  SELECT operations_with_parameters.api_operations_id,
         (param.entry ->> 'name'::text) AS name,
         (param.entry ->> 'in'::text) AS "in",
       replace(
         CASE
         WHEN ((param.entry ->> 'in'::text) = 'body'::text) 
           AND ((param.entry -> 'schema'::text) is not null)
             THEN ((param.entry -> 'schema'::text) ->> '$ref'::text)
         ELSE (param.entry ->> 'type'::text)
        END, '#/definitions/','') AS resource,
        -- CASE
        -- WHEN ((param.entry ->> 'in'::text) = 'body'::text) THEN ((param.entry -> 'schema'::text) ->> '$ref'::text)
        -- ELSE (param.entry ->> 'description'::text)
        -- END AS description,
        (param.entry ->> 'description'::text) AS description,
         CASE
         WHEN ((param.entry ->> 'required'::text) = 'true') THEN true
         ELSE false
        END AS required,
        CASE
         WHEN ((param.entry ->> 'uniqueItems'::text) = 'true') THEN true
         ELSE false
        END AS unique_items
        -- param.entry AS full_entry
    FROM operations_with_parameters,
         LATERAL jsonb_array_elements(operations_with_parameters.parameters) WITH ORDINALITY param(entry, index);
