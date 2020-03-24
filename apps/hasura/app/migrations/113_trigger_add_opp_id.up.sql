-- 113: add_opp_id trigger
--     :PROPERTIES:
--     :header-args:sql-mode+: :tangle ./app/migrations/113_trigger_add_opp_id.up.sql
--     :END:
    
--     #+NAME: Create Trigger

-- [[file:~/apisnoop/apps/hasura/index.org::Create%20Trigger][Create Trigger]]
CREATE TRIGGER add_op_id
  BEFORE INSERT ON audit_event
  FOR EACH ROW
    WHEN (NEW.job = 'live')
    EXECUTE PROCEDURE add_op_id();
-- Create Trigger ends here
