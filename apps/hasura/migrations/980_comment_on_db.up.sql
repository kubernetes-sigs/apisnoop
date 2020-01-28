-- 100: Bucket Job Swagger
-- #+NAME: Comments on bucket_job_swagger

COMMENT ON TABLE bucket_job_swagger IS 'metadata for audit events  and their respective swagger.json';
COMMENT ON column bucket_job_swagger.ingested_at IS 'timestamp for when data added to table';
COMMENT ON column bucket_job_swagger.bucket IS 'storage bucket for audit event test run and swagger';
COMMENT ON column bucket_job_swagger.job IS 'specific job # of audit event test run';
COMMENT ON column bucket_job_swagger.commit_hash IS 'git commit hash for this particular test run';
COMMENT ON column bucket_job_swagger.passed IS 'whether test run passed';
COMMENT ON column bucket_job_swagger.job_result IS 'whether test run was successful.';
COMMENT ON column bucket_job_swagger.pod IS 'The pod this test was run on';
COMMENT ON column bucket_job_swagger.job_version IS 'version of k8s on which this job was run';
COMMENT ON column bucket_job_swagger.job_timestamp IS 'timestamp when job was run.  Will be different from ingested_at.';
COMMENT ON column bucket_job_swagger.node_os_image IS 'id for which node image was used for test run';
COMMENT ON column bucket_job_swagger.node_os_image IS 'id for which master os image was used for test run';
COMMENT ON column bucket_job_swagger.swagger IS 'raw json of the open api spec for k8s as of the commit hash for this test run.';

-- 110: raw_audit_event

COMMENT ON TABLE  raw_audit_event IS 'a record for each audit event in an audit log';
COMMENT ON COLUMN raw_audit_event.bucket IS 'The testrun bucket for the event';
COMMENT ON COLUMN raw_audit_event.job IS 'The testrun job for the event';
COMMENT ON COLUMN raw_audit_event.audit_id IS 'The id for the event';
COMMENT ON COLUMN raw_audit_event.stage IS 'stage of event';
COMMENT ON COLUMN raw_audit_event.event_verb IS 'verb of event';
COMMENT ON COLUMN raw_audit_event.request_uri IS 'cluster uri that event requested';
COMMENT ON COLUMN raw_audit_event.operation_id IS 'operation_id hit by event';
COMMENT ON COLUMN raw_audit_event.data IS 'full raw data of event';

-- 200: api_operation_material

COMMENT ON MATERIALIZED VIEW api_operation_material IS 'details on each operation_id as taken from the openAPI spec';
COMMENT ON COLUMN api_operation_material.operation_id IS 'Also referred to as endpoint.  Name for the action at a given path';
COMMENT ON COLUMN api_operation_material.level IS 'Alpha, Beta, or Stable. The level of stability of an endpoint';
COMMENT ON COLUMN api_operation_material.category IS 'will either be analogous with the k8s group or "core".';
COMMENT ON COLUMN api_operation_material.k8s_group IS 'kubernetes group this operation_id belongs to';
COMMENT ON COLUMN api_operation_material.k8s_version IS 'kubernetes version (e.g alpha or beta or stable)';
COMMENT ON COLUMN api_operation_material.k8s_kind IS 'kubernetes kind';
COMMENT ON COLUMN api_operation_material.deprecated IS 'whether operation_id has deprecated in its description';
COMMENT ON COLUMN api_operation_material.description IS 'description of operation_id';
COMMENT ON COLUMN api_operation_material.http_method IS 'http equivalent for operation, e.g. GET, POST, DELETE';
COMMENT ON COLUMN api_operation_material.k8s_action IS 'the k8s analog for the http_method';
COMMENT ON COLUMN api_operation_material.event_verb IS 'a more succinct description of k8s_action';
COMMENT ON COLUMN api_operation_material.path IS 'location in cluster of endpoint for this operation_id';
COMMENT ON COLUMN api_operation_material.consumes IS 'what the operation_id consumes';
COMMENT ON COLUMN api_operation_material.responses IS 'how the operation_id responds';
COMMENT ON COLUMN api_operation_material.parameters IS 'parameters of operation_id';
COMMENT ON COLUMN api_operation_material.tags IS 'tags of operation_id';
COMMENT ON COLUMN api_operation_material.schemes IS 'schemes of operation_id';
COMMENT ON COLUMN api_operation_material.regex IS 'regex pattern for how to match to this operation_id. Likely  not needed anymore.';
COMMENT ON COLUMN api_operation_material.bucket IS 'the testrun bucket this operation_id belongs to';
COMMENT ON COLUMN api_operation_material.job IS 'the testrun job this operation_id belongs to';

-- 220: api_operation_material

COMMENT ON MATERIALIZED VIEW api_operation_parameter_material IS 'the parameters for each operation_id in open API spec';
COMMENT ON column api_operation_parameter_material.param_op IS 'the operation_id this parameter belongs to';
COMMENT ON column api_operation_parameter_material.param_name IS 'the name of the parameter';
COMMENT ON column api_operation_parameter_material.param_schema IS 'schema for param, if available, otherwise its type';
COMMENT ON column api_operation_parameter_material.required IS 'whether operation_id requires this parameter';
COMMENT ON column api_operation_parameter_material.param_description IS 'description given for parameter';
COMMENT ON column api_operation_parameter_material.unique_items IS 'whether parameter has unique items';
COMMENT ON column api_operation_parameter_material.in IS 'value of "in" key in parameter entry';
COMMENT ON column api_operation_parameter_material.bucket IS 'testrun bucket of operation_id this parameter belongs to';
COMMENT ON column api_operation_parameter_material.job IS 'testrun job of operation_id this parameter belongs to';
COMMENT ON column api_operation_parameter_material.entry IS 'full json blog of parameter entry';

-- 300: audit_event

COMMENT ON VIEW audit_event IS 'a record for each audit event in an audit log';
COMMENT ON COLUMN audit_event.audit_id IS 'The id for the event';
COMMENT ON COLUMN audit_event.bucket IS 'The testrun bucket for the event';
COMMENT ON COLUMN audit_event.job IS 'The testrun job for the event';
COMMENT ON COLUMN audit_event.event_level IS 'level of event';
COMMENT ON COLUMN audit_event.event_stage IS 'stage of event';
COMMENT ON COLUMN audit_event.operation_id IS 'operation_id hit by event';
COMMENT ON COLUMN audit_event.param_schema IS 'parameter schema for operation_id';
COMMENT ON COLUMN audit_event.api_version IS 'k8s api version used in testrun';
COMMENT ON COLUMN audit_event.request_uri IS 'cluster uri that event requested';
COMMENT ON COLUMN audit_event.useragent IS 'useragent making request';
COMMENT ON COLUMN audit_event.object_namespace IS 'namespace from objectRef of event';
COMMENT ON COLUMN audit_event.object_type IS 'resource from objectRef of event';
COMMENT ON COLUMN audit_event.object_group IS 'apiGroup from objectRef of event';
COMMENT ON COLUMN audit_event.object_ver IS 'apiVersion from objectRef of event';
COMMENT ON COLUMN audit_event.source_ips IS 'sourceIPs of event';
COMMENT ON COLUMN audit_event.annotations IS 'annotations of event';
COMMENT ON COLUMN audit_event.request_object IS 'full requestObject from event';
COMMENT ON COLUMN audit_event.response_object IS 'full responseObject from event';
COMMENT ON COLUMN audit_event.stage_timestamp IS 'timestamp of event';
COMMENT ON COLUMN audit_event.request_received_timestamp IS 'timestamp when request received';
COMMENT ON COLUMN audit_event.data IS 'full raw data of event';

-- 500: endpoint_coverage

COMMENT ON VIEW endpoint_coverage IS 'the test hits and conformance test hits per operation_id & other useful details';
COMMENT ON COLUMN endpoint_coverage.date IS 'Date of test run according to its metadata';
COMMENT ON COLUMN endpoint_coverage.bucket IS 'The testrun bucket for the event';
COMMENT ON COLUMN endpoint_coverage.job IS 'The testrun job for the event';
COMMENT ON COLUMN endpoint_coverage.operation_id IS 'operation_id of endpoint.  Two terms used interchangably';
COMMENT ON COLUMN endpoint_coverage.level IS 'Alpha, Beta, or Stable. The level of stability of an endpoint';
COMMENT ON COLUMN endpoint_coverage.category IS 'will either be analogous with the k8s group or "core".';
COMMENT ON COLUMN endpoint_coverage.group IS 'kubernetes group this operation_id belongs to';
COMMENT ON COLUMN endpoint_coverage.version IS 'kubernetes version (e.g alpha or beta or stable)';
COMMENT ON COLUMN endpoint_coverage.kind IS 'kubernetes kind';
COMMENT ON COLUMN endpoint_coverage.tested IS 'boolean on whether any e2e. useragent hits this endpoint';
COMMENT ON COLUMN endpoint_coverage.conf_tested IS 'boolean on whether any useragent with [Conformance] in name hits endpoint';
COMMENT ON COLUMN endpoint_coverage.hit IS 'boolean whether endpoint hit by any useragent';

-- 520: stable_endpoint_stats

COMMENT ON VIEW stable_endpoint_stats IS 'coverage stats for entire test run, looking only at its stable endpoints';
COMMENT ON COLUMN stable_endpoint_stats.job IS 'The testrun job';
COMMENT ON COLUMN stable_endpoint_stats.date IS 'Date of test run according to its metadata';
COMMENT ON COLUMN stable_endpoint_stats.total_endpoints IS 'number of stable endpoints in this test run';
COMMENT ON COLUMN stable_endpoint_stats.test_hits IS 'number of stable, tested endpoints in this test run';
COMMENT ON COLUMN stable_endpoint_stats.conf_hits IS 'number of stable, conformance tested endpoints in this test run';
COMMENT ON COLUMN stable_endpoint_stats.percent_tested IS 'percent of total, stable endpoints in the run that are tested';
COMMENT ON COLUMN stable_endpoint_stats.percent_conf_tested IS 'percent of stable endpoints in the run that are conformance tested';

-- 600: untested_stable_core_endpoints

COMMENT ON VIEW untested_stable_core_endpoints IS 'list stable core endpoints not hit by any tests, according to their test run';
COMMENT ON COLUMN untested_stable_core_endpoints.date IS 'Date of test run according to its metadata';
COMMENT ON COLUMN untested_stable_core_endpoints.bucket IS 'The testrun bucket for the event';
COMMENT ON COLUMN untested_stable_core_endpoints.job IS 'The testrun job for the event';
COMMENT ON COLUMN untested_stable_core_endpoints.operation_id IS 'operation_id of endpoint.  Two terms used interchangably';
COMMENT ON COLUMN untested_stable_core_endpoints.level IS 'Alpha, Beta, or Stable. The level of stability of an endpoint';
COMMENT ON COLUMN untested_stable_core_endpoints.category IS 'will either be analogous with the k8s group or "core".';
COMMENT ON COLUMN untested_stable_core_endpoints.group IS 'kubernetes group this operation_id belongs to';
COMMENT ON COLUMN untested_stable_core_endpoints.version IS 'kubernetes version (e.g alpha or beta or stable)';
COMMENT ON COLUMN untested_stable_core_endpoints.kind IS 'kubernetes kind';
COMMENT ON COLUMN untested_stable_core_endpoints.description IS 'description of operation_id';
COMMENT ON COLUMN untested_stable_core_endpoints.http_method IS 'http equivalent for operation, e.g. GET, POST, DELETE';
COMMENT ON COLUMN untested_stable_core_endpoints.k8s_action IS 'the k8s analog for the http_method';
COMMENT ON COLUMN untested_stable_core_endpoints.path IS 'location in cluster of endpoint for this operation_id';

-- 610: endpoints_hit_by_new_test

COMMENT ON VIEW endpoints_hit_by_new_test IS 'list endpoints hit during our live auditing alongside their current test coverage';
COMMENT ON COLUMN endpoints_hit_by_new_test.useragent IS 'the useragent that hit the endpoint as captured by apisnoop';
COMMENT ON COLUMN endpoints_hit_by_new_test.operation_id IS 'the operation_id hit';
COMMENT ON COLUMN endpoints_hit_by_new_test.hit_by_ete IS 'number of times this endpoint is hit, according to latest test run';
COMMENT ON COLUMN endpoints_hit_by_new_test.hit_by_new_test IS 'number of times the useragent hit this endpoint, according to apisnoop';

-- 620: projected_change_in_coverage

COMMENT ON VIEW projected_change_in_coverage IS 'overview of coverage stats if the e2e suite included your tests';
COMMENT ON COLUMN projected_change_in_coverage.total_endpoints IS 'number of stable, core endpoints as of the latest test run';
COMMENT ON COLUMN projected_change_in_coverage.old_coverage IS 'number of stable, core endpoints hit by tests, as of the latest test run';
COMMENT ON COLUMN projected_change_in_coverage.new_coverage IS 'number of stable, core endpoints hit by tests, when including those hit by your tests';
COMMENT ON COLUMN projected_change_in_coverage.change_in_number IS 'new_coverage less old_coverage';
