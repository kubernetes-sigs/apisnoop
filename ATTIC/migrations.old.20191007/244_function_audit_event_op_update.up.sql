-- Create
-- #+NAME: audit_events_op_update.sql

set role dba;
CREATE OR REPLACE FUNCTION audit_event_op_update()
RETURNS text AS $$
#!/bin/bash
(echo 'hello'
 pwd
 id
 env
 unset PGLOCALEDIR
 unset PGSYSCONFDIR
 /usr/local/bin/rmatch || echo FAILS
) 2>&1 > /tmp/rmatch.log
$$ LANGUAGE plsh ;
reset role;
