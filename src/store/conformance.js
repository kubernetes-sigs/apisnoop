import { writable, derived } from 'svelte/store';
import semver from 'semver';

export const confFilters = writable({
  release: ''
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
      set($endpoints.filter(ep => ep.promotion_release === $filters.release &&
                                  ep.tested_release === $filters.release));
    }
  }
);

export const untested = derived(
  [confEndpoints, confFilters],
  ([$endpoints, $filters], set) => {
    if ($endpoints.length === 0 || $filters.release === '') {
      set([]);
    } else {
      set($endpoints.filter(ep => {
        return semver.lt(ep.promotion_release, $filters.release) &&
               ep.tested_release == null;
      }));
    }
  }
);
