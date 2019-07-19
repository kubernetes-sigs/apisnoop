

-- #+NAME: CREATE TABLE audit_events

CREATE TABLE public.audit_events (
  "auditID" uuid,
  level text NOT NULL,
  verb text NOT NULL,
  "requestURI" text NOT NULL,
  "userAgent" text,
  "testName" text,
  requestKind text NOT NULL,
  requestApiVersion text NOT NULL,
  requestMeta jsonb NOT NULL,
  requestSpec jsonb NOT NULL,
  requestStatus jsonb NOT NULL,
  responseKind text NOT NULL,
  responseApiVersion text NOT NULL,
  responseMeta jsonb NOT NULL,
  responseSpec jsonb NOT NULL,
  responseStatus jsonb NOT NULL,
  "timeStamp" timestamp with time zone
);
