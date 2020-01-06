import { gql } from 'apollo-boost';

export const ENDPOINTS = gql`
  {
  endpoint_coverage(where: {bucket: {_neq: "apisnoop"}}) {
    operation_id
    level
    category
    conf_hits
    test_hits
    other_hits
  }
  bucket_job_swagger(where: {bucket: {_neq: "apisnoop"}}) {
    bucket
    job
    job_timestamp
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
