create table conformance.pending_eligible_endpoint(
      endpoint text not null,
      primary key (endpoint)
);

comment on table conformance.pending_eligible_endpoint is 'eligible endpoints given a grace period before they fail the conformance gate';
comment on column conformance.pending_eligible_endpoint.endpoint is 'the pending eligible endpoint';
