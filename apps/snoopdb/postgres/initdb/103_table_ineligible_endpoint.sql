create table conformance.ineligible_endpoint(
      endpoint text not null,
      reason text,
      link text,
      primary key (endpoint)
);

comment on view conformance.ineligible_endpoint is 'endpoints ineligible for conformance testing';
comment on column conformance.ineligible_endpoint.endpoint is 'the ineligible endpoint';
comment on column conformance.ineligible_endpoint.reason is 'reason, from conformance guidelines, for ineligibility';
comment on column conformance.ineligible_endpoint.link is 'url source for reason';
