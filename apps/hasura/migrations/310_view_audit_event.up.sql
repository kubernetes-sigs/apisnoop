-- Create
--     #+NAME: view audit_event

CREATE OR REPLACE VIEW "public"."audit_event" AS
  SELECT * 
    FROM 
        audit_event_material;
