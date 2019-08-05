-- operations_with_parameters view
-- #+NAME: operations_with_parameters

CREATE OR REPLACE VIEW "public"."operations_with_parameters" AS 
  SELECT api_operations.parameters
    FROM api_operations
   WHERE (api_operations.parameters IS NOT NULL)
   ORDER BY (uuid_generate_v1());
