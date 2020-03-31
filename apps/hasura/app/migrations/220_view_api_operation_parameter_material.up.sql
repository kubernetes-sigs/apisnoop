-- Create
--  Using our api_operation_material view, look into the parameters field in each one.
--  #+NAME: api_operation_parameter_material view

-- [[file:~/apisnoop/apps/hasura/index.org::api_operation_parameter_material%20view][api_operation_parameter_material view]]
CREATE MATERIALIZED VIEW "public"."api_operation_parameter_material" AS
  SELECT ao.operation_id AS param_op,
  (param.entry ->> 'name'::text) AS param_name,
         -- for resource:
         -- if param is body in body, take its $ref from its schema
         -- otherwise, take its type
         replace(
           CASE
           WHEN ((param.entry ->> 'in'::text) = 'body'::text)
            AND ((param.entry -> 'schema'::text) is not null)
             THEN ((param.entry -> 'schema'::text) ->> '$ref'::text)
           ELSE (param.entry ->> 'type'::text)
           END, '#/definitions/','') AS param_schema,
         CASE
         WHEN ((param.entry ->> 'required'::text) = 'true') THEN true
         ELSE false
          END AS required,
         (param.entry ->> 'description'::text) AS param_description,
         CASE
         WHEN ((param.entry ->> 'uniqueItems'::text) = 'true') THEN true
         ELSE false
         END AS unique_items,
         (param.entry ->> 'in'::text) AS "in",
         ao.bucket,
         ao.job,
         param.entry as entry
    FROM api_operation_material ao
         , jsonb_array_elements(ao.parameters) WITH ORDINALITY param(entry, index)
          WHERE ao.parameters IS NOT NULL;
-- api_operation_parameter_material view ends here

-- Index
--  #+NAME: index the api_operation_material

-- [[file:~/apisnoop/apps/hasura/index.org::index%20the%20api_operation_material][index the api_operation_material]]
CREATE INDEX api_parameters_materialized_schema      ON api_operation_parameter_material            (param_schema);
-- index the api_operation_material ends here
