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
