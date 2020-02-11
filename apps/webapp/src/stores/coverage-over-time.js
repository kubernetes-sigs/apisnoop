import dayjs from 'dayjs';
import { derived }  from 'svelte/store';
import { sortBy } from 'lodash-es';
import {
    bucketsAndJobs,
    defaultBucketAndJob,
    stableEndpointStats
} from './index.js';

export const dates = derived(
    [bucketsAndJobs, defaultBucketAndJob],
    ([$bjs, $default], set) => {
        if ($bjs.length === 0) {
            set([])
        } else {
            let bucket = $default.bucket;
            let jobs = sortBy($bjs[bucket]['jobs'], 'timestamp');
            set(jobs.map(job => job.timestamp));
        }
    }
);

export const coverage = derived(
    [defaultBucketAndJob, stableEndpointStats],
    ([$default, $stats], set) => {
        console.log({default: $default})
        if ($default.bucket === '') {
            set([]);
        } else {
            console.log({stats: $stats })
            let coverageStats = $stats
                .filter(stat => stat.job !== 'live')
                .map(stat => ({...stat, timestamp: dayjs(stat.date)}));

            console.log({coverageStats})
            set(coverageStats);
        }
    }
);


