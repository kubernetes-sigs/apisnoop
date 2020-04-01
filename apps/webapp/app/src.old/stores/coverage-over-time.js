import dayjs from 'dayjs';
import { derived }  from 'svelte/store';
import {
    findKey,
    flatten,
    sortBy
} from 'lodash-es';
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
            // let bucket = $default.bucket;
            let buckets = Object.keys($bjs);
            let allJobs = buckets.reduce((acc, cur) => {
                let jobs = sortBy($bjs[cur]['jobs'], 'timestamp');
                return [...acc, ...jobs];
            }, []);

            allJobs = sortBy(allJobs,'timestamp');
            set(allJobs.map(job => job.timestamp));
        }
    }
);

export const coverage = derived(
    [defaultBucketAndJob, stableEndpointStats, bucketsAndJobs],
    ([$default, $stats, $bjs], set) => {
        if ($default.bucket === '') {
            set([]);
        } else {
            let coverageStats = $stats
                .filter(stat => stat.job !== 'live')
                .map(stat => {
                    let bucket = findKey($bjs, (o) => o.jobs.map(job => job.job).includes(stat.job))
                    console.log({bucket});
                    return {
                        ...stat,
                        bucket,
                        timestamp: dayjs(stat.date)
                    };
                });
            coverageStats = sortBy(coverageStats, 'timestamp');
            set(coverageStats);
        }
    }
);


