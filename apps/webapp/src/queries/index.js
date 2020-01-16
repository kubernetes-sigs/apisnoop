import { gql } from 'apollo-boost';

export const ENDPOINTS = gql`
  query ENDPOINTS ($bucket: String!, $job: String!){
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
// All tests for endpoint, where test includes test.name and test.tag
export const ALL_TESTS_FOR_ENDPOINT = gql`
query ALL_TESTS_FOR_ENDPOINT ($bucket: String!, $job: String!, $operation_id: String!){
  endpoint_coverage(where: {bucket: {_eq: $bucket}, job: {_eq: $job}, operation_id: {_eq: $operation_id}}) {
    tests {
      test
      test_tag
    }
  }
}
`
