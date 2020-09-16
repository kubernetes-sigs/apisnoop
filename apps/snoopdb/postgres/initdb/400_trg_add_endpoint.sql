create trigger add_endpoint
before insert on testing.audit_event
for each row
execute procedure determine_endpoint();
