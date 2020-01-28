-- Index
-- #+NAME: index the api_operation_material

CREATE INDEX api_operation_materialized_bucket      ON api_operation_material            (bucket);
CREATE INDEX api_operation_materialized_event_verb  ON api_operation_material            (event_verb);
CREATE INDEX api_operation_materialized_k8s_action  ON api_operation_material            (k8s_action);
CREATE INDEX api_operation_materialized_k8s_group   ON api_operation_material            (k8s_group);
CREATE INDEX api_operation_materialized_k8s_version ON api_operation_material            (k8s_version);
CREATE INDEX api_operation_materialized_k8s_kind    ON api_operation_material            (k8s_kind);
CREATE INDEX api_operation_materialized_tags        ON api_operation_material            (tags);
CREATE INDEX api_operation_materialized_schemes     ON api_operation_material            (schemes);
CREATE INDEX api_operation_materialized_regex_gist  ON api_operation_material USING GIST (regex gist_trgm_ops);
CREATE INDEX api_operation_materialized_regex_gin   ON api_operation_material USING GIN  (regex gin_trgm_ops);
CREATE INDEX api_operation_materialized_consumes_ops   ON api_operation_material USING GIN  (consumes jsonb_ops);
CREATE INDEX api_operation_materialized_consumes_path  ON api_operation_material USING GIN  (consumes jsonb_path_ops);
CREATE INDEX api_operation_materialized_parameters_ops   ON api_operation_material USING GIN  (parameters jsonb_ops);
CREATE INDEX api_operation_materialized_parameters_path  ON api_operation_material USING GIN  (parameters jsonb_path_ops);
CREATE INDEX api_operation_materialized_responses_ops   ON api_operation_material USING GIN  (responses jsonb_ops);
CREATE INDEX api_operation_materialized_responses_path  ON api_operation_material USING GIN  (responses jsonb_path_ops);
