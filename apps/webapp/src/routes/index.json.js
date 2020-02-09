import client from "../apollo.js";
import { determineBucketAndJob } from '../lib/helpers.js';
import { ALL_BUCKETS_AND_JOBS_SANS_LIVE, STABLE_ENDPOINT_STATS } from '../queries';
import {
    rawBucketsAndJobs,
    stableEndpointStats
} from '../stores';

export async function get(req, res) {
    let bucketAndJobsQuery = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE});
    let statsQuery = await client.query({query: STABLE_ENDPOINT_STATS});
    let rawBucketsAndJobsPayload = bucketAndJobsQuery.data.bucket_job_swagger;
    let statsPayload = statsQuery.data.stable_endpoint_stats;
    let {bucket, job} = determineBucketAndJob(rawBucketsAndJobsPayload);
    const contents = JSON.stringify(statsPayload);
    rawBucketsAndJobs.set(rawBucketsAndJobsPayload);

    stableEndpointStats.set(statsPayload)
	  res.writeHead(200, {
		    'Content-Type': 'application/json'
	  });
	  res.end(contents);
}
