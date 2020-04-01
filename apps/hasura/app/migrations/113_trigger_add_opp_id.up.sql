CREATE TRIGGER add_op_id
  BEFORE INSERT ON audit_event
  FOR EACH ROW
    WHEN (NEW.job = 'live')
    EXECUTE PROCEDURE add_op_id();
