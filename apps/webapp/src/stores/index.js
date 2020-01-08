import { writable, derived } from 'svelte/store';
import client from '../apollo.js';
import { ALL_BUCKETS_AND_JOBS_SANS_LIVE } from '../queries';

import {
    isEmpty,
    groupBy,
    keyBy,
    map,
    mapValues,
    orderBy,
    sortBy
} from 'lodash-es';

import {
    levelColours,
    categoryColours,
    endpointColour
} from '../lib/colours.js';

export const rawMetadata = writable([]);

async function fetchBucketsAndJobs () {
    let metadata = await client.query({query: ALL_BUCKETS_AND_JOBS_SANS_LIVE}) 
    rawMetadata.set(metadata.data.bucket_job_swagger)
}

export const bucketsAndJobs = derived(rawMetadata, ($rm, set) => {
    // group by buckets and their jobs, noting the most recent job for each bucket.
    if (isEmpty($rm)) {
        set({});
    } else {
        let buckets = groupBy($rm, 'bucket');
        let bj = mapValues(buckets, (allJobs) => {
            let [latestJob] = allJobs
                .sort((a,b) => new Date(b.job_timestamp) > new Date(a.job_timestamp))
                .map(j => j.job);

            let jobs = allJobs.map(j => ({job: j.job, timestamp: j.job_timestamp}));

            return {
                latestJob,
                jobs
            };
        });
        set(bj);
    }
});

export const defaultBucketAndJob = derived(bucketsAndJobs, ($bj, set) => {
    if (isEmpty($bj))  {
        set({})
    } else {
        let releaseBlocking = 'ci-kubernetes-e2e-gci-gce';
        let defaultBucket = Object.keys($bj).includes(releaseBlocking)
            ? releaseBlocking
            : Object.keys($bj)[0];

        set({
            bucket: defaultBucket,
            job: $bj[defaultBucket].latestJob
        });
    }
});

export const activeBucketAndJob = writable({});

export const endpoints = writable([]);

export const opIDs = derived(endpoints, ($ep, set) => {
    if ($ep.length > 0) {
        set(keyBy($ep, 'operation_id'));
    } else {
        set([]);
    }
});

export const groupedEndpoints = derived(endpoints, ($ep, set) => {
    if ($ep.length > 0) {
        let endpointsByLevel = groupBy($ep, 'level')
        set(mapValues(endpointsByLevel, endpointsInLevel => {
            let endpointsByCategory = groupBy(endpointsInLevel, 'category')
            return mapValues(endpointsByCategory, endpointsInCategory => {
                return endpointsInCategory.map (endpoint => {
                    return {
                        ...endpoint,
                        name: endpoint.operation_id,
                        value: 1,
                        color: endpointColour(endpoint)
                    };
                });
            });
        }));
    } else {
        set({});
    }
});


export const sunburst = derived(groupedEndpoints, ($gep, set) => {
    if (!isEmpty($gep)) {
        var sunburst = {
            name: 'root',
            color: 'white',
            children: map($gep, (endpointsByCategoryAndOpID, level) => {
                return {
                    name: level,
                    color: levelColours[level] || levelColours['unused'],
                    children: map(endpointsByCategoryAndOpID, (endpointsByOpID, category) => {
                        return {
                            name: category,
                            color: categoryColours[category] ||  'rgba(183, 28, 28, 1)', // basic color so things compile right.
                            children: sortBy(endpointsByOpID, [
                                (endpoint) => endpoint.testHits > 0,
                                (endpoint) => endpoint.conformanceHits > 0
                            ])
                        };
                    })
                };
            })
        };
        sunburst.children = orderBy(sunburst.children, 'name', 'desc');
        set(sunburst)
    } else {
        set({})
    }
});

fetchBucketsAndJobs();
