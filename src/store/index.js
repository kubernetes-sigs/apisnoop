import { readable, writable, derived } from 'svelte/store';
import {
  compact,
  differenceBy,
  flatten,
  groupBy,
  isEmpty,
  map,
  mapValues,
  orderBy,
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

import { RELEASES } from '../lib/constants.js';

export const versions = readable(
  // sort RELEASES by minor release in the semver.
  RELEASES.sort((a, b) => b.split('.')[1] - a.split('.')[1])
);

export const latestVersion = derived(
  versions,
  ($ver, set) => {
    set($ver[0]);
  }
);

export const releases = writable(
  // Our list of RELEASES converted to object, with each release as key to empty object.
  mapValues(groupBy(RELEASES), ([release]) => ({
    release,
    spec: '',
    source: '',
    release_date: new Date(),
    endpoints: [],
    tests: []
  }))
);

// Based on url query params, any filters being set.
export const activeFilters = writable({
  test_tags: [],
  useragent: '',
  level: '',
  category: '',
  endpoint: '',
  version: ''
});

export const activeRelease = derived(
  // The release whose key is the current version filter,
  // (which will be set by our url)
  [releases, latestVersion, activeFilters],
  ([$r, $v, $a], set) => {
    if (!$a.version || $a.version === '') {
      set($r[$v]);
    } else {
      set($r[$a.version]);
    }
  }
);

export const previousRelease = derived(
  [releases, versions, activeRelease],
  ([$rels, $versions, $active], set) => {
    const activeIdx = $versions.indexOf($active.release);
    const prevVersion = $versions[activeIdx + 1];
    if (prevVersion) {
      set($rels[prevVersion]);
    } else {
      set({});
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

export const endpoints = derived(activeRelease, ($rel, set) => {
  if ($rel) {
    set($rel.endpoints);
  } else {
    set([]);
  }
});

export const newEndpoints = derived(
  // endpoints that are in active release, but not previous release, filtered to current level and or category.
  [activeRelease, previousRelease, activeFilters],
  ([$eps, $peps, $filters], set) => {
    if ($peps.endpoints) {
      const eps = $eps.endpoints;
      const peps = $peps.endpoints;
      let newEndpoints = differenceBy(eps, peps, 'endpoint');
      if ($filters.level !== '') {
        newEndpoints = newEndpoints.filter(ep => ep.level === $filters.level);
      }
      if ($filters.category !== '') {
        newEndpoints = newEndpoints.filter(ep => ep.category === $filters.category);
      }
      set(orderBy(newEndpoints, ['level', 'category'], ['desc', 'asc']));
    } else {
      set([]);
    }
  });

export const groupedEndpoints = derived(endpoints, ($eps, set) => {
  if ($eps.length > 0) {
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
export const conformanceProgressRaw = writable([]);

export const conformanceProgress = derived(
  conformanceProgressRaw,
  ($cpr, set) => {
    if ($cpr.length === 0) {
      set([]);
    } else {
      set($cpr.map(({total, release}) => {
        let tested = total.tested - total.new_tested;
        let new_untested = total.new - total.new_tested;
        let new_tested = total.new_tested;
        let untested = total.endpoints - new_untested - tested - new_tested;
        return {
          release,
          total: {
            tested,
            untested,
            new_untested,
            new_tested
          }
        };
      }));
    }
  }
);


export const formattedProgress = derived(
  conformanceProgress,
  ($cp, set) => {
    if ($cp.length === 0) {
      set([]) ;
    } else {
      let order = {tested: "a", new_tested: "b",  untested: "c",  new_untested: "d"};
      let progress = $cp
          .filter(rel => rel.release !== '1.8.0')
          .map(rel => {
            const {release, total} = rel;
            const formattedTotals = values(mapValues(total, (v,k) => ({
              release: release,
              type: k,
              total: v,
              order: order[k]
            })));
            return formattedTotals;
          });
      set(flatten(progress));
    }
  }
);


export const coveragePerReleaseRaw = writable([]);

export const coveragePerRelease = derived(
  coveragePerReleaseRaw,
  ($cpr, set) => {
    if ($cpr.length === 0) {
      set([]);
    } else {
      let ratioSet = $cpr.map(({release, tested, untested}) => ({
            release: release === "1.5.0" ? "1.5.0 and Earlier" : release,
            total: {
              tested,
              untested: (untested * -1) // this is to make it show as split ratio graph
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

export const conformanceProgressPercentage = derived(
  conformanceProgressRaw,
  ($cp, set) => {
    if ($cp.length === 0) {
      set([]);
    } else {
      let percentageSet = $cp.map((c) => {
        return {
          release: c.release === "1.5.0" ? "1.5.0 and Earlier" : c.release,
          total: {
            tested: c.total.tested,
            untested: c.total.endpoints - c.total.tested
          }
        };
      });
      let formattedRatio = percentageSet.map(({release, total}) => {
        return values(mapValues(total, (v,k) => ({
          release: release,
          type: k,
          total: v,
          order: k === "total tested" ? "a" : "b"
        })));
      });
      set(flatten(formattedRatio));
    }
  }
)
