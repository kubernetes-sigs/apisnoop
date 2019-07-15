CREATE TABLE public.audit_events (
  "auditID" uuid,
  level text NOT NULL,
  verb text NOT NULL,
  "requestURI" text NOT NULL,
  "userAgent" text,
  "testName" text
);
