import { gql } from 'apollo-boost';
export const ENDPOINTS_USERAGENTS_AND_TESTS = gql`
query ENDPOINTS_TESTS_AND_USERAGENTS($bucket: String, $job: String) {
  endpoints: endpoint_coverage(where: {bucket: {_eq: $bucket}, job: {_eq: $job}}) {
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
  useragents(where: {bucket: {_eq: $bucket}, job: {_eq: $job}}) {
    useragent
    operation_ids
  }
}
`

export const ENDPOINTS_TESTS_AND_USERAGENTS = gql`
query ENDPOINTS_TESTS_AND_USERAGENTS($bucket: String, $job: String) {
  endpoints: endpoint_coverage(where: {bucket: {_eq: $bucket}, job: {_eq: $job}}) {
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
  useragents(where: {bucket: {_eq: $bucket}, job: {_eq: $job}}) {
    useragent
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
`;

export const STABLE_ENDPOINT_STATS = gql`
query STABLE_ENDPOINT_STATS {
  stable_endpoint_stats(where: {job: {_neq: "live"}}) {
    conf_hits
    date
    job
    percent_conf_tested
    percent_tested
    test_hits
    total_endpoints
  }
}
`;
