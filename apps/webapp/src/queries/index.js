import { gql } from 'apollo-boost';

export const ENDPOINTS_AND_TESTS = gql`
query ENDPOINTS_AND_TESTS($bucket: String, $job: String) {
  endpoint_coverage(where: {bucket: {_eq: $bucket}, job: {_eq: $job}}) {
    operation_id
    level
    category
    conf_tested
    tested
    hit
    details {
      description
      path
      k8s_group
      k8s_kind
    }
  }
  tests(where: {bucket: {_eq: $bucket}, job: {_eq: $job}}) {
    test
    test_tags
    operation_ids
  }
}

`


// All buckets and jobs available in db that are not 'live'
export const ALL_BUCKETS_AND_JOBS_SANS_LIVE = gql`
{
  bucket_job_swagger(where: {bucket: {_neq: "apisnoop"}}) {
    bucket
    job
    job_timestamp
  }
}
`
