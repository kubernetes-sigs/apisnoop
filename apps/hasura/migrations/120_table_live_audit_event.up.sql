-- Create
-- #+NAME: raw_audit_event

CREATE UNLOGGED TABLE live_audit_event (
  bucket text,
  job text,
  audit_id text NOT NULL,
  stage text NOT NULL,
  event_verb text NOT NULL,
  request_uri text NOT NULL,
  operation_id text,
  data jsonb NOT NULL
);

-- Index
-- #+NAME: index the raw_audit_event

CREATE INDEX idx_live_audit_event_jsonb_ops        ON live_audit_event USING GIN (data jsonb_ops);
CREATE INDEX idx_live_audit_event_jsonb_path_jobs  ON live_audit_event USING GIN (data jsonb_path_ops);
