CREATE TABLE bucket_job_swagger (
    ingested_at timestamp DEFAULT CURRENT_TIMESTAMP,
    bucket text,
    job text,
    commit_hash text,
    passed text,
    job_result text,
    pod text,
    infra_commit text,
    job_version text,
    job_timestamp timestamp,
    node_os_image text,
    master_os_image text ,
    swagger jsonb,
    PRIMARY KEY (bucket, job)
);

CREATE INDEX idx_swagger_jsonb_ops ON bucket_job_swagger
  USING GIN (swagger jsonb_ops);
CREATE INDEX idx_swagger_jsonb_path_ops ON bucket_job_swagger
  USING GIN (swagger jsonb_path_ops);
