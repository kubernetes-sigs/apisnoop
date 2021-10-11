import { readable, writable, derived } from 'svelte/store';
import semver from 'semver';
import {
  compact,
  differenceBy,
  flatten,
  groupBy,
  keyBy,
  last,
  isEmpty,
  map,
  mapValues,
  orderBy,
  reverse,
  sortBy,
  take,
  uniq,
  values
} from 'lodash-es';

import {
  categoryColours,
  endpointColour,
  levelColours
} from '../lib/colours.js';

import { EARLIEST_VERSION } from '../lib/constants.js';

import {
  confEndpointsRaw
} from './conformance.js';

export const releases = writable([])

export const versions = derived(releases, ($releases, set) => {
  // shorthand of the versions we have available, sorted by newest.
  if (!isEmpty($releases)) {
    const versions = sortBy($releases, 'release_date')
          .map(r=>r.release)
          .sort((a,b) => semver.gt(b,a) ? 1 : -1);
    console.log({v: versions})
    set(versions);
  } else {
    set([])
  }
});

export const latestVersion = derived(
  versions,
  ($v, set) => {
    if (!isEmpty($v)) {
      set($v[0]);
    } else {
      set('');
    }
  }
);

// Based on url query params, any filters being set.
export const activeFilters = writable({
  test_tags: [],
  useragent: '',
  level: '',
  category: '',
  endpoint: '',
  version: '',
  conformanceOnly: false
});

export const activeRelease = derived(
  // The release whose key is the current version filter,
  // (which will be set by our url)
  [releases, latestVersion, activeFilters],
  ([$r, $v, $a], set) => {
    if (isEmpty($r)) {
      set({});
    }
    if (!$a.version || $a.version === '') {
      set($r[$v]);
    } else if (semver.lt($a.version, EARLIEST_VERSION)){
      set('older');
    } else {
      set($r[$a.version])
    }
  }
);

export const previousVersion = derived(
  // according to semver, the previous release from active one.
  // used to fetch the next release when someone is visiting a page.
  [releases, activeRelease],
  ([$rels, $active], set) => {
    if ($active && $active.release) {
      const versions = sortBy($rels, 'release_date')
            .map(r=>r.release)
            .sort((a,b)=> semver.gt(b,a) ? 1 : -1);
      console.log({versions})
      const activeIdx = versions.indexOf($active.release);
      const prevVersion = versions[activeIdx + 1];
      if (prevVersion) {
        set(prevVersion)
      } else {
        set('older')
      }
    } else {
      set('older');
    }
  }
);

// holds information on when user mouse is hovering over part of sunburst
export const mouseOverPath = writable([]);

export const breadcrumb = derived(
  [activeFilters, mouseOverPath],
  ([$active, $mouse], set) => {
    const mouseCrumbs = $mouse.map(m => m.data.name);
    const activeAndMouseCrumbs = compact(uniq([$active.level, $active.category, $active.endpo8, ...mouseCrumbs]));
    let crumbs = [];
    // if length is 4, it means we are zoomed into an endpoint, and hovering over a different endpoint.
    if (activeAndMouseCrumbs.length === 4) {
      // if that's the case, we want to show the one we are hovered on.
      crumbs = activeAndMouseCrumbs.filter(crumb => crumb !== $active.endpoint);
    } else {
      crumbs = take(compact(uniq([$active.level, $active.category, $active.endpoint, ...mouseCrumbs])), 3);
    }
    set(crumbs);
  }
);

export const endpoints = derived(
  [activeRelease, confEndpointsRaw, activeFilters],
  ([$rel, $conformanceEndpoints, $filters], set) => {
  if ($rel) {
    if ($filters.conformanceOnly) {
      const conformanceEndpoints = $conformanceEndpoints.map(c=>c.endpoint);
      const eligibleEndpoints = $rel.endpoints.filter(e => conformanceEndpoints.includes(e.endpoint));
      set(eligibleEndpoints);
    } else {
      set($rel.endpoints);
    }
  } else {
    set([]);
  }
});

export const newEndpoints = derived(
  // endpoints that are in active release, but not previous release, filtered to current level and or category.
  [activeRelease, previousVersion, releases, activeFilters],
  ([$active, $prev, $rels, $filters], set) => {
    const previousRelease = $rels[$prev]
    if (previousRelease && previousRelease.endpoints) {
      const eps = $active.endpoints;
      const peps = previousRelease.endpoints;
      let newEndpoints = differenceBy(eps, peps, 'endpoint');
      if ($filters.level !== '') {
        newEndpoints = newEndpoints.filter(ep => ep.level === $filters.level);
      }
      if ($filters.category !== '') {
        newEndpoints = newEndpoints.filter(ep => ep.category === $filters.category);
      }
      set(orderBy(newEndpoints, ['level', 'conf_tested', 'tested', 'category', 'endpoint'], ['desc', 'asc', 'asc', 'asc', 'asc']));
    } else {
      set([]);
    }
  });

export const newCoverage = derived(
  // from active release, tested endpoints that exist in previous release
  // but were untested in that release.
  [activeRelease, previousVersion, activeFilters],
  ([$eps, $peps, $filters], set) => {
    if ($peps.endpoints) {
      const eps = $eps.endpoints;
      const peps = $peps.endpoints;
      let newCoverage = eps
        .filter(ep => {
          const pep = peps.find(p => p.endpoint === ep.endpoint);
          return pep &&
            ep.tested === true &&
            pep.tested === false;
        })
        .map(ep => {
          const {
            release,
            endpoint,
            level,
            category
          } = ep;
          const test = ep.tests[0];
          return {
            release,
            endpoint,
            level,
            category,
            test
          };
        });

      if ($filters.level !== '') {
        newCoverage = newCoverage.filter(ep => ep.level === $filters.level);
      }
      if ($filters.category !== '') {
        newCoverage = newCoverage.filter(ep => ep.category === $filters.category);
      }
      set(orderBy(newCoverage, ['level', 'conf_tested', 'tested', 'category', 'endpoint'], ['desc', 'asc', 'asc', 'asc', 'asc']));
    } else {
      set([]);
    }
  }
);

export const groupedEndpoints = derived([activeRelease, endpoints], ([$ar, $eps], set) => {
  if ($eps && $eps.length > 0) {
    const epsByLevel = groupBy($eps, 'level');
    set(mapValues(epsByLevel, epsInLevel => {
      const epsByCategory = groupBy(epsInLevel, 'category');
      return mapValues(epsByCategory, epsInCategory => {
        return epsInCategory.map(ep => {
          return {
            ...ep,
            name: ep.endpoint,
            value: 1,
            color: endpointColour(ep)
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
      children: map($gep, (endpointsByCategoryAndEndpoint, level) => {
        return {
          name: level,
          color: levelColours[level] || levelColours['unused'],
          level: level,
          category: '',
          endpoint: '',
          children: map(endpointsByCategoryAndEndpoint, (endpointsByEndpoint, category) => {
            return {
              name: category,
              level: level,
              category: category,
              endpoint: '',
              color: categoryColours[category] ||  'rgba(183, 28, 28, 1)', // basic color so things compile right.
              children: sortBy(endpointsByEndpoint, [
                (endpoint) => endpoint.tested,
                (endpoint) => endpoint.conf_tested
              ])
            };
          })
        };
      })
    };
    sunburst.children = orderBy(sunburst.children, 'name', 'desc');
    set(sunburst);
  } else {
    set({});
  }
});

export const zoomedSunburst = derived(
  [sunburst, activeFilters],
  ([$sunburst, $filters], set) => {
    let { level, category } = $filters;
    if (!isEmpty($sunburst) && category) {
      let sunburstAtLevel = $sunburst.children.find(child => child.name === level);
      let sunburstAtCategory = sunburstAtLevel.children.find(child => child.name === category);
      set(sunburstAtCategory);
    } else if (!isEmpty($sunburst) && !category && level) {
      let sunburstAtLevel = $sunburst.children.find(child => child.name === level);
      set(sunburstAtLevel);
    } else {
      set($sunburst);
    }
  });

export const currentDepth = derived(breadcrumb, ($breadcrumb, set) => {
  let depths = ['root', 'level', 'category', 'endpoint'];
  let depth = $breadcrumb.length;
  set(depths[depth]);
});

export const coverageAtDepth = derived([breadcrumb, currentDepth, endpoints], ([$bc, $depth, $eps], set) => {
  let eps;
  if (isEmpty($eps)) {
    set({});
    return;
  } else if ($bc.length === 0) {
    eps = $eps;
  } else if ($bc.length === 1) {
    eps = $eps.filter(ep => ep.level === $bc[0]);
  } else if ($bc.length === 2) {
    eps = $eps.filter(ep => ep.level === $bc[0] && ep.category === $bc[1]);
  } else if ($bc.length === 3) {
    eps = $eps.filter(ep => ep.level === $bc[0] && ep.category === $bc[1] && ep.endpoint === $bc[2]);
  } else {
    eps = $eps;
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

export const endpointCoverage = derived([breadcrumb, currentDepth, endpoints], ([$bc, $cd, $eps], set) => {
  let currentEndpoint;
  let opId;
  let defaultCoverage = {
    tested: '',
    endpoint: '',
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
    opId = $bc[2];
    currentEndpoint = $eps.find(ep => ep.endpoint === opId);
    let {
      tested,
      conf_tested: confTested,
      endpoint,
      path,
      description,
      k8s_group: group,
      k8s_version: version,
      k8s_kind: kind
    } = currentEndpoint;
    set({
      tested,
      confTested,
      endpoint,
      path,
      description,
      group,
      version,
      kind
    });
  }
});

// brings in raw conformance-progress.json to be
// turned into vega-lite ready data for conformance-progress page

export const stableCoverageAtReleaseRaw = writable([]);

export const stableCoverageAtRelease = derived(
  stableCoverageAtReleaseRaw,
  ($raw, set) => {
    if ($raw.length === 0) {
      set([]);
    } else {
      const stableCoverage = $raw.map(({ total, release }) => {
        const tested = total.tested - total.new_tested - total.old_tested;
        const newUntested = total.new - total.new_tested;
        const newTested = total.new_tested;
        const untested = total.endpoints - newUntested - tested - newTested - total.old_tested;
        return {
          release,
          total: {
            'Previously Tested (past regular development)': tested,
            'Still Untested (technical debt)': untested,
            'Old Endpoints Covered By New Tests (paying off technical debt)': total.old_tested,
            'New Endpoints Promoted Without Tests (this should not happen)': newUntested,
            'New Endpoints Promoted With Tests (regular new development)': newTested
          }
        };
      });
      const order = {
        'Previously Tested (past regular development)': {filter: 'tested', order: 'a'},
        'Old Endpoints Covered By New Tests (paying off technical debt)': {filter: 'old-covered-by-new', order: 'b'},
        'New Endpoints Promoted With Tests (regular new development)': {filter: 'promoted-with-tests', order: 'c'},
        'Still Untested (technical debt)': {filter: 'untested', order: 'd'},
        'New Endpoints Promoted Without Tests (this should not happen)': {filter: 'promoted-without-tests', order: 'e'}
      };
      const formattedStableCoverage = stableCoverage
        .filter(rel => rel.release !== '1.8.0')
        .map(rel => {
          const { release, total } = rel;
          const formattedTotals = values(mapValues(total, (v, k) => ({
            release: release,
            href: `/conformance-progress/endpoints/${release}/?filter=${order[k]['filter']}`,
            type: k,
            total: v,
            order: order[k]['order']
          })));
          return formattedTotals;
        });
      set(flatten(formattedStableCoverage));
    }
  }
);

export const coverageByReleaseRaw = writable([]);

export const coverageByRelease = derived(
  coverageByReleaseRaw,
  ($cpr, set) => {
    if ($cpr.length === 0) {
      set([]);
    } else {
      let ratioSet = $cpr.map(({release, tested, untested}) => ({
            release: release === "1.5.0" ? "1.5.0 and Earlier" : release,
            total: {
              Tested: tested,
              Untested: (untested * -1) // this is to make it show as split ratio graph
            }
          }));

      let formattedRatio = ratioSet.map(({release, total}) => {
        return values(mapValues(total, (v,k) => ({
          release: release,
          type: k,
          total: v
        })));
      });
      set(flatten(formattedRatio));
    }
  }
);

export const olderNewEndpointsRaw = writable([]);

export const olderNewEndpoints = derived(
  olderNewEndpointsRaw,
  ($raw, set) => {
    if (isEmpty($raw)) {
      set({});
    } else {
      set(keyBy($raw, 'release'));
    }
  }
);
