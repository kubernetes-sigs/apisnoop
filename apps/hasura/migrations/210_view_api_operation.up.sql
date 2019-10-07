-- Create View
-- #+NAME: api_operation view

CREATE OR REPLACE VIEW "public"."api_operation" AS 
  SELECT * from api_operation_material;

select * from api_operation limit 3;
