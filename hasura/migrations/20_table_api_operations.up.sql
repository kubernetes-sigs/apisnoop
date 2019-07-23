-- table
-- #+NAME: CREATE TABLE audit_events

CREATE TABLE public.api_operations (
    id text NOT NULL,
    method text NOT NULL,
    path text NOT NULL,
    regexp text NOT NULL,
    "group" text NOT NULL,
    version text NOT NULL,
    kind text NOT NULL,
    "category" text NOT NULL,
    description text NOT NULL
  );
-- Indexes
create index api_operations_id on api_operations(id);
create index api_operations_method on api_operations(method);
create index api_operations_regexp on api_operations(regexp);
