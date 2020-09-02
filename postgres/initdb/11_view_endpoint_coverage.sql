create or replace view endpoint_coverage as
select release, endpoint, level, category, path, description,
       k8s_kind as kind,
       k8s_version as version,
       k8s_group as group,
       k8s_action as action,
       (count(test_hit) filter(where test_hit is true)>0) as tested,
       (count(conf_test_hit) filter(where conf_test_hit is true)>0) as conf_tested,
       array_agg(distinct test) as tests
  from      open_api
  left join audit_event using (endpoint, release)
 where deprecated is false
 group by release, endpoint, level, category, path, description, kind, version, k8s_group, k8s_action
 order by level desc, endpoint;

comment on view endpoint_coverage is 'Coverage info for every endpoint in a release, taken from audit events for that release';

comment on column endpoint_coverage.release is 'Release the endpoint details come from';
comment on column endpoint_coverage.endpoint is 'a kubernetes endpoint, the operation_id in the spec';
comment on column endpoint_coverage.level is 'alpha, beta, or stable';
comment on column endpoint_coverage.category is 'endpoint category, roughly its group, taken from the first tag in the spec.';
comment on column endpoint_coverage.path is 'the http path of the endpoint';
comment on column endpoint_coverage.group is 'k8s group for endpoint';
comment on column endpoint_coverage.version is 'k8s version for endpoint';
comment on column endpoint_coverage.kind  is 'k8s kind  for endpoint';
comment on column endpoint_coverage.action is 'endpoint action, roughly related to an http method';
comment on column endpoint_coverage.tested is 'was endpoint hit at least once by a test useragent';
comment on column endpoint_coverage.conf_tested is 'was endpoint hit at least once by a conformance test useragent';
comment on column endpoint_coverage.tests is 'array of codenames of all tests that hit this endpoint';
