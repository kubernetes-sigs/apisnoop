import { writable, derived } from 'svelte/store';
import client from '../apollo.js';
import {
  hitByMatchingItems,
  hitByMatchingTestTags,
  isValidRegex,
  toBoolean
} from '../lib/helpers.js';

import {
  compact,
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

// Based on url query params, any filters being set.
export const activeFilters = writable({
  test_tags: [],
  hide_tested: "false",
  hide_conf_tested: "false",
  hide_untested: "false",
  useragent: '',
  tests_match: '',
  test_tags_match: '',
  bucket: '',
  job: '',
  level: '',
  category: '',
  operation_id: ''
})

export const mouseOverPath = writable([]);
export const warnings = writable({
  invalidBucket: false,
  invalidJob: false,
  invalidLevel: false,
  invalidCategory: false,
  invalidEndpoint: false
})

// Buckets and Jobs
export const rawBucketsAndJobs = writable([]);
export const bucketsAndJobs = derived(
  rawBucketsAndJobs,
  ($raw, set) => {
    if ($raw.length === 0) {
      set([]);
    } else {
      let buckets = groupBy($raw, 'bucket');
      let bjs = mapValues(buckets, (allJobs) => {
        let jobs = allJobs
            .sort((a,b) => new Date(b.job_timestamp) > new Date(a.job_timestamp))
            .map(j => ({
              job: j.job,
              timestamp: j.job_timestamp
            }));

        let [latestJob] = jobs;

        return {
          latestJob,
          jobs
        };
      });
      set(bjs);
    };
  }
);

export const defaultBucketAndJob = derived(
  bucketsAndJobs,
  ($bjs, set) => {
    if ($bjs.length === 0) {
      set({
        bucket: '',
        job: '',
        timestamp: ''
      });
    } else {
      let releaseBlocking = 'ci-kubernetes-e2e-gci-gce';
      let defaultBucket = Object.keys($bjs).includes(releaseBlocking)
          ? releaseBlocking
          : Object.keys($bjs)[0];

      set({
        bucket: defaultBucket,
        job: $bjs[defaultBucket].latestJob.job,
        timestamp: $bjs[defaultBucket].latestJob.job_timestamp
      });
    };
  }
);

export const activeBucketAndJob = derived(
  [activeFilters, defaultBucketAndJob, ],
  ([$filters, $default], set) => {
    let base = {
      bucket: '',
      job: '',
      timestamp: ''
    };
    if ($default.bucket === '') {
      set({...base});
    } else if ($filters.bucket === '') {
      set({
        ...base,
        bucket: $default.bucket,
        job: $default.job,
        timestamp: $default.timestamp
      });
    } else {
      set({
        ...base,
        bucket: $filters.bucket,
        job: $filters.job,
        timestamp: $filters.timestamp
      });
    };
  });

// All our data, for the active bucket and job. 
export const endpointsTestsAndUseragents = writable({endpoints: '', tests: '', useragents: ''});
export const endpoints = derived(endpointsTestsAndUseragents, $etu => $etu.endpoints);
export const allTestsAndTags = derived(endpointsTestsAndUseragents, $etu => $etu.tests);
export const allUseragents = derived(endpointsTestsAndUseragents, $etu => $etu.useragents);
// Based on the url params, the exact [level, category, endpoint] we are focused on.
export const activePath = writable([]);

export const opIDs = derived(endpoints, ($ep, set) => {
  if ($ep.length > 0) {
    set(keyBy($ep, 'operation_id'));
  } else {
    set([]);
  }
});

export const filteredEndpoints = derived(
  [activeFilters, endpoints, allUseragents, allTestsAndTags],
  ([$af, $ep, $ua, $tt], set) => {
    if ($ep.length === 0) {
      set([]);
    } else {
      let endpoints = $ep
          .filter(ep => toBoolean($af.hide_tested) ? (ep.tested === false || ep.conf_tested === true) : ep)
          .filter(ep => toBoolean($af.hide_conf_tested) ? ep.conf_tested === false : ep)
          .filter(ep => toBoolean($af.hide_untested) ? ep.tested === true : ep)
          .filter(ep => ($af.useragent.length > 0 && isValidRegex($af.useragent) && $ua)
                  ? hitByMatchingItems($ua, 'useragent', $af.useragent, ep)
                  : ep)
          .filter(ep => ($af.tests_match.length > 0 && isValidRegex($af.tests_match) && $tt)
                  ? hitByMatchingItems($tt, 'test', $af.tests_match, ep)
                  : ep)
          .filter(ep => ($af.test_tags_match.length > 0 && isValidRegex($af.test_tags_match) && $tt)
                  ? hitByMatchingTestTags($tt, $af.test_tags_match, ep)
                  : ep);
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
          level: level,
          category: '',
          operation_id: '',
          children: map(endpointsByCategoryAndOpID, (endpointsByOpID, category) => {
            return {
              name: category,
              level: level,
              category: category,
              operation_id: '',
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

export const zoomedSunburst = derived(
  [sunburst, activeFilters],
  ([$sunburst, $filters], set) => {
    let level = $filters.level;
    let category = $filters.category
    if (category) {
      let sunburstAtLevel = $sunburst.children.find(child => child.name === level);
      let sunburstAtCategory = sunburstAtLevel.children.find(child => child.name === category);
      set(sunburstAtCategory);
    } else if (!category && level) {
      let sunburstAtLevel = $sunburst.children.find(child => child.name === level);
      set(sunburstAtLevel);
    } else {
      set($sunburst)
    }
  })

export const currentDepth = derived(activePath, ($ap, set) => {
  let depths = ['root', 'level', 'category', 'endpoint']
  let depth = $ap.length;
  set(depths[depth])
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

export const breadcrumb = derived(
  [activeFilters, mouseOverPath],
  ([$active, $mouse], set) => {
    let mouseCrumbs = $mouse.map(m => m.data.name);
    let crumbs = take(compact([$active.level, $active.category, $active.operation_id, ...mouseCrumbs]), 3);
    set(crumbs)
  });
