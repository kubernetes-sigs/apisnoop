import { writable, derived } from 'svelte/store';
import client from '../apollo.js';
import { ALL_BUCKETS_AND_JOBS_SANS_LIVE } from '../queries';

import {
    concat,
    isArray,
    isEmpty,
    flattenDeep,
    groupBy,
    intersection,
    keyBy,
    map,
    mapValues,
    orderBy,
    sortBy,
    take,
    uniq
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

// Based on the url params o, the exact [level, category, endpoint] we are focused on.
export const activePath = writable([]);

// Based on url query params, any filters being set.
export const activeFilters = writable({
    test_tags: [],
    hide_tested: false,
    hide_conf_tested: true,
    hide_untested: true,
    useragent: ``
})

export const bucketsAndJobs = derived(rawMetadata, ($rm, set) => {
    // group by buckets and their jobs, noting the most recent job for each bucket.
    if (isEmpty($rm)) {
        set({});
    } else {
        let buckets = groupBy($rm, 'bucket');
        let bj = mapValues(buckets, (allJobs) => {
            let [latestJob] = allJobs
                .sort((a,b) => new Date(b.job_timestamp) > new Date(a.job_timestamp))
                .map(j => ({job: j.job, timestamp: j.job_timestamp}));

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
            job: $bj[defaultBucket].latestJob.job,
            timestamp: $bj[defaultBucket].latestJob.job_timestamp
        });
    }
});

export const activeBucketAndJob = writable({});

export const bucketAndJobMetadata = derived([bucketsAndJobs, activeBucketAndJob], ([$bjs, $abj], set) => {
    if (isEmpty($bjs)) {
        set({bucket: '', job: '', timestamp: ''})
    } else {
        set({
            bucket: $abj.bucket,
            job: $abj.job,
            timestamp: $bjs[$abj.bucket].jobs.find(j => j.job === $abj.job).timestamp
        });
    };
});

export const endpoints = writable([]);

export const opIDs = derived(endpoints, ($ep, set) => {
    if ($ep.length > 0) {
        set(keyBy($ep, 'operation_id'));
    } else {
        set([]);
    }
});

export const filteredEndpoints = derived([activeFilters, endpoints], ([$af, $ep], set) => {
    if ($ep.length === 0) {
        set([]);
    } else {
        let endpoints = $ep
            .filter(ep => $af.hide_tested ? ep.tested === false : ep)
            .filter(ep => $af.hide_conf_tested ? ep.conf_tested === false : ep)
            .filter(ep => $af.hide_untested ? ep.tested === true : ep);
        set(endpoints)
    }
});

export const groupedEndpoints = derived(filteredEndpoints, ($ep, set) => {
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

export const currentDepth = derived(activePath, ($ap, set) => {
    let depths = ['root', 'level', 'category', 'endpoint']
    let depth = $ap.length;
    set(depths[depth])
});

export const breadcrumb = derived(
    [activePath],
    ($ap) => {
        // We want breadcrumb to be an array of [level, category, method]
        // so we fill out any empty position in activPath with ''
        let filler = ['','',''];
        let bc = $ap[0].concat(filler);
        return take(bc, 3);
    });

export const coverageAtDepth = derived([activePath, currentDepth, filteredEndpoints], ([$ap, $cd, $eps], set) => {
    let eps;
    if (isEmpty($eps)) {
        set({})
        return;
    } else if ($cd === 'root') {
        eps = $eps;
    } else if ($cd === 'level') {
        eps = $eps.filter(ep => ep.level === $ap[0])
    } else if ($cd === 'category') {
        eps = $eps.filter(ep => ep.level === $ap[0] && ep.category === $ap[1])
    } else if ($cd === 'endpoint') {
        eps = $eps.filter(ep => ep.level === $ap[0] && ep.category === $ap[1] && ep.operation_id === $ap[2])
    }

    let totalEndpoints = eps.length;
    let testedEndpoints = eps.filter(ep => ep.tested).length;
    let confTestedEndpoints = eps.filter(ep => ep.conf_tested).length;
    set({
        totalEndpoints,
        testedEndpoints,
        confTestedEndpoints
    });
});

export const endpointCoverage = derived([activePath, currentDepth, filteredEndpoints], ([$ap, $cd, $eps], set) => {
    let endpoint;
    let opId;
    let defaultCoverage = {
        tested: '',
        operation_id : '',
        confTested: '',
        description: '',
        path: '',
        group: '',
        version: '',
        kind: ''
    };
    if (isEmpty($eps) || $cd !== 'endpoint') {
        set(defaultCoverage);
    } else {
        opId = $ap[2]
        endpoint = $eps.find(ep => ep.operation_id === opId)
        let {
            tested,
            conf_tested: confTested,
            operation_id,
            details : {
                path,
                description,
                k8s_group: group,
                k8s_version: version,
                k8s_kind: kind
            }
        } = endpoint;
        set({
            tested,
            confTested,
            operation_id,
            path,
            description,
            group,
            version,
            kind
        });
    }
});

export const allTestsAndTags = writable({});

export const testsForEndpoint = derived(
    [allTestsAndTags, activePath, currentDepth],
    ([$tt, $ap, $cd], set) => {
        if (isEmpty($tt) || $cd !== 'endpoint') {
            set([]);
        } else {
            let opID = $ap[2];
            let tests = $tt
                .filter(t => t.operation_ids.includes(opID))
            set(tests);
        }
    }
);

export const testTagsForEndpoint = derived(
    [allTestsAndTags, activePath, currentDepth],
    ([$tt, $ap, $cd], set) => {
        if (isEmpty($tt) || $cd !== 'endpoint') {
            set([]);
        } else {
            let opID = $ap[2];
            let testTags = $tt
                .filter(t => t.operation_ids.includes(opID))
                .map(t => t.test_tags);
            let testTagsUniq = uniq(flattenDeep(testTags))
            set(testTagsUniq);
        }
    }
);

export const validTestTagFilters = derived(
    [activeFilters, testTagsForEndpoint],
    ([$af, $tt], set) => {
        if ($af.test_tags.length === 0 || $tt.length === 0) {
            set([]);
        } else {
            let validFilters = isArray($af.test_tags)
                ? $af.test_tags.filter(f => $tt.includes(f))
                : [$af.test_tags].filter(f => $tt.includes(f));
            set(validFilters);
        }
    });

export const filteredTests = derived(
    [testsForEndpoint, validTestTagFilters],
    ([$t, $vf]) => {
        let tests;
        if ($vf.length === 0) {
            tests = $t; 
        } else {
            tests = $t.filter(test => {
                return intersection(test.test_tags, $vf).length > 0;
            });
        }
        return tests;
    });

fetchBucketsAndJobs();
