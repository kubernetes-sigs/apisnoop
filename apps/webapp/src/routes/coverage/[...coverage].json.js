import client from "../../apollo.js";
import { determineBucketAndJob } from '../../lib/helpers.js';
import { ENDPOINTS_TESTS_AND_USERAGENTS, ALL_BUCKETS_AND_JOBS_SANS_LIVE} from '../../queries';

export async function get (req, res, next) {
    let bucketAndJobsQuery = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE});
    let rawBucketsAndJobsPayload = bucketAndJobsQuery.data.bucket_job_swagger;
    let query = req.query;
    let [bucketParam, jobParam, level, category, operation_id] = req.params.coverage;
    let {bucket, job} = determineBucketAndJob(rawBucketsAndJobsPayload, bucketParam, jobParam);
    let endpointsTestsAndUseragentsFromQuery = await client.query(
        {query: ENDPOINTS_TESTS_AND_USERAGENTS,
         variables: {bucket, job}
        });

    let allTheThings = {
        bucket,
        bucketParam,
        category,
        endpointsTestsAndUseragentsFromQuery,
        job,
        jobParam,
        level,
        operation_id,
        query,
        rawBucketsAndJobsPayload
    };

    let payload = JSON.stringify(allTheThings);

    res.writeHead(200, {
        'Content-Type': 'application/json' ,
    });
    res.end(payload);
};
