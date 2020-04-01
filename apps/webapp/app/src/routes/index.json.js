import client from "../apollo.js";
import { determineBucketAndJob } from '../lib/helpers.js';
import {
  ALL_BUCKETS_AND_JOBS_SANS_LIVE,
  STABLE_ENDPOINT_STATS } from '../queries';

export async function get(req, res) {
  let bucketAndJobsQuery = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE});
  let rawBucketsAndJobsPayload = bucketAndJobsQuery.data.bucket_job_swagger;

  let statsQuery = await client.query({query: STABLE_ENDPOINT_STATS});
  let stableEndpointStatsPayload = statsQuery.data.stable_endpoint_stats;

  const payload = JSON.stringify({
    stableEndpointStatsPayload,
    rawBucketsAndJobsPayload
  });

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(payload);
}
