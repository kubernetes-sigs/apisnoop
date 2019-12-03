-- 910: Populate Swaggers Up
--   :PROPERTIES:
--   :header-args:sql-mode+: :tangle ../apps/hasura/migrations/910_load_and_populate_swaggers.up.sql
--   :header-args:sql-mode+: :results silent
--   :END:

select * from load_swagger();
--populate the apisnoop/live bucket/job to help when writing test functions
select * from load_swagger(null, null, true);
