

-- #+NAME: CREATE TABLE audit_events

CREATE TABLE public.audit_events (
    audit_id uuid NOT NULL,
    testrun_id text,
    op_id text,
    stage text NOT NULL,
    level text NOT NULL,
    verb text NOT NULL,
    request_uri text NOT NULL,
    user_agent text,
    test_name text,
    requestkind text NOT NULL,
    requestapiversion text NOT NULL,
    requestmeta jsonb NOT NULL,
    requestspec jsonb NOT NULL,
    requeststatus jsonb NOT NULL,
    responsekind text NOT NULL,
    responseapiversion text NOT NULL,
    responsemeta jsonb NOT NULL,
    responsespec jsonb NOT NULL,
    responsestatus jsonb NOT NULL,
    request_ts timestamp with time zone,
    stage_ts timestamp with time zone
  );
-- Indexes
create index audit_events_op_id on audit_events(op_id);
create index audit_events_verb on audit_events(verb);
create index audit_events_request_uri on audit_events(request_uri);
