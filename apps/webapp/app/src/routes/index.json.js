import client from "../apollo.js";
import { determineBucketAndJob } from '../lib/helpers.js';
import {
  ALL_BUCKETS_AND_JOBS_SANS_LIVE,
  ENDPOINTS_TESTS_AND_USERAGENTS,
  STABLE_ENDPOINT_STATS } from '../queries';

export async function get(req, res) {
  let bucketAndJobsQuery = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE});
  let rawBucketsAndJobsPayload = bucketAndJobsQuery.data.bucket_job_swagger;

  let statsQuery = await client.query({query: STABLE_ENDPOINT_STATS});
  let stableEndpointStatsPayload = statsQuery.data.stable_endpoint_stats;

  let {bucket, job} = determineBucketAndJob(rawBucketsAndJobsPayload);

  let endpointsTestsAndUseragentsQuery = await client.query(
    {query: ENDPOINTS_TESTS_AND_USERAGENTS,
     variables: {bucket, job}
    });
  let endpointsTestsAndUseragentsPayload = endpointsTestsAndUseragentsQuery.data;

  const payload = JSON.stringify({
    stableEndpointStatsPayload,
    rawBucketsAndJobsPayload,
    endpointsTestsAndUseragentsPayload
  });

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(payload);
}
