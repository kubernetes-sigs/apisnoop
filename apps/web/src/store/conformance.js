import { writable, derived } from 'svelte/store';
import { flatten } from 'lodash-es';
import { conformanceColours} from '../lib/colours.js';
import semver from 'semver';

export const confFilters = writable({
  release: '',
  promotedWithTests: true,
  promotedWithoutTests: true,
  oldCoveredByNew: true,
  tested: true,
  untested: true
});

export const confEndpointsRaw = writable([]);

export const confEndpoints = derived(
  [confEndpointsRaw, confFilters],
  ([$raw, $filters], set) => {
    if ($raw.length === 0) {
      set([]);
    } else {
      if ($filters.release !== '') {
        set($raw.filter(ep => semver.lte(ep.promotion_release, $filters.release)));
      } else {
        set($raw);
      }
    }
  }
);

export const promotedWithTests = derived(
  [confEndpoints, confFilters],
  ([$endpoints, $filters], set) => {
    if ($endpoints.length === 0 || $filters.release === '') {
      set([]);
    } else {
      const group = $endpoints.filter(ep => ep.promotion_release === $filters.release &&
                                          ep.tested_release === $filters.release);
      const colour = conformanceColours.promotedWithTests;
      set(group.map(ep => ({...ep, colour})));
    }
  }
);

export const promotedWithoutTests = derived(
  [confEndpoints, confFilters],
  ([$endpoints, $filters], set) => {
    if ($endpoints.length === 0 || $filters.release === '') {
      set([]);
    } else {
      const group = $endpoints.filter(ep => (ep.promotion_release === $filters.release && ep.tested_release == null) ||
                                      (ep.promotion_release == $filters.release && semver.gt(ep.tested_release, $filters.release)));
      const colour = conformanceColours.promotedWithoutTests;
      set(group.map(ep => ({...ep, colour})));
    }
  }
);

export const oldCoveredByNew = derived(
  [confEndpoints, confFilters],
  ([$endpoints, $filters], set) => {
    if ($endpoints.length === 0 || $filters.release === '') {
      set([]);
    } else {
      const group = $endpoints.filter(ep => {
        return semver.lt(ep.promotion_release, $filters.release) &&
          ep.tested_release !== null &&
          ep.tested_release === $filters.release;
      });
      const colour = conformanceColours.oldCoveredByNew;
      set(group.map(ep => ({...ep, colour})));
    }
  }
);

export const untested = derived(
  [confEndpoints, confFilters],
  ([$endpoints, $filters], set) => {
    if ($endpoints.length === 0 || $filters.release === '') {
      set([]);
    } else {
      const group = $endpoints.filter(ep => {
        return semver.lt(ep.promotion_release, $filters.release) &&
               ep.tested_release == null;
      });
      const colour = conformanceColours.untested;
      set(group.map(ep => ({...ep, colour})));
    }
  }
);

export const tested = derived(
  [confEndpoints, confFilters],
  ([$endpoints, $filters], set) => {
    if ($endpoints.length === 0 || $filters.release === '') {
      set([]);
    } else {
      const group = $endpoints.filter(ep => {
        return semver.lt(ep.promotion_release, $filters.release) &&
               ep.tested_release !== null &&
               semver.lt(ep.tested_release, $filters.release);
      });
      const colour = conformanceColours.oldCoveredByNew;
      set(group.map(ep => ({...ep, colour})));
    }
  }
);

export const confFilteredEndpoints = derived(
  [
    promotedWithTests,
    promotedWithoutTests,
    oldCoveredByNew,
    tested,
    untested,
   confFilters
  ],
  ([
    $promotedWith,
    $promotedWithout,
    $oldCovered,
    $tested,
    $untested,
    $filters
  ], set) => {
    const groupings = {
      promotedWithoutTests: $promotedWithout,
      promotedWithTests: $promotedWith,
      oldCoveredByNew: $oldCovered,
      tested: $tested,
      untested: $untested
    };
    const activeFilters = Object.keys(groupings).filter(g => $filters[g] === true);
    const activeGroupings = activeFilters.map(filter => groupings[filter]);
    set(flatten(activeGroupings));
  }
)

export const ineligibleEndpointsRaw = writable([]);

export const ineligibleEndpoints = derived(
  ineligibleEndpointsRaw,
  ($raw, set) => {
    if ($raw.length === 0) {
      set([]);
    } else {
      set($raw.map(e => ({
        endpoint: e.endpoint,
        reason: e.reason,
        link: e.link,
        sql: e['sql logic']
      })));
    }
  }
);
