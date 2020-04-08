import client from "../apollo.js";
import { determineBucketAndJob } from '../lib/helpers.js';
import {
  ALL_BUCKETS_AND_JOBS_SANS_LIVE,
  ENDPOINTS_TESTS_AND_USERAGENTS,
  STABLE_ENDPOINT_STATS } from '../queries';

export async function get (req, res, next) {
  let bucketAndJobsQuery = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE});
  let rawBucketsAndJobsPayload = bucketAndJobsQuery.data.bucket_job_swagger;

  let statsQuery = await client.query({query: STABLE_ENDPOINT_STATS});
  let stableEndpointStatsPayload = statsQuery.data.stable_endpoint_stats;

  let query = req.query;
  let [bucketParam, jobParam, level, category, operation_id] = req.params.params;
  let {bucket, job} = determineBucketAndJob(rawBucketsAndJobsPayload, bucketParam, jobParam);

  let endpointsTestsAndUseragentsFromQuery = await client.query(
    {query: ENDPOINTS_TESTS_AND_USERAGENTS,
     variables: {bucket, job}
    });
  let endpointsTestsAndUseragentsPayload = endpointsTestsAndUseragentsFromQuery.data

  let allTheThings = {
    bucket,
    bucketParam,
    category,
    endpointsTestsAndUseragentsPayload,
    job,
    jobParam,
    level,
    operation_id,
    query,
    rawBucketsAndJobsPayload,
    stableEndpointStatsPayload
  };

  let payload = JSON.stringify(allTheThings);
  console.log('payload! from server', bucket, job, endpointsTestsAndUseragentsPayload.endpoints.length);
  res.writeHead(200, {
    'Content-Type': 'application/json' ,
  });
  res.end(payload);
};
