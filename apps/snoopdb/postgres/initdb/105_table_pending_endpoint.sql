create table conformance.pending_endpoint(
      endpoint text not null,
      primary key (endpoint)
);

comment on table conformance.pending_endpoint is 'endpoints pending for conformance testing';
comment on column conformance.pending_endpoint.endpoint is 'the pending endpoint';
