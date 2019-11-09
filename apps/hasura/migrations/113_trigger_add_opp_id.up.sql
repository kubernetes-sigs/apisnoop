-- 113: add_opp_id trigger
--   :PROPERTIES:
--   :header-args:sql-mode+:  :tangle ../apps/hasura/migrations/113_trigger_add_opp_id.up.sql
--   :END:
--    #+NAME: Create Trigger

CREATE TRIGGER add_op_id BEFORE INSERT ON raw_audit_event
  FOR EACH ROW EXECUTE PROCEDURE add_op_id();
