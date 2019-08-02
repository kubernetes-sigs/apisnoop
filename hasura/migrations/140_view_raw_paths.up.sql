-- raw_paths view

-- #+NAME: raw_paths view

CREATE OR REPLACE VIEW "public"."raw_paths" AS 
  SELECT raw_swaggers.id AS raw_swagger_id,
         d.key AS path,
         d.value
    FROM (raw_swaggers
          JOIN LATERAL jsonb_each((raw_swaggers.data -> 'paths'::text)) d(key, value) ON (true))
   ORDER BY d.key;
