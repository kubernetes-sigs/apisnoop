import { writable, derived } from 'svelte/store';
import {
  compact,
  groupBy,
  isEmpty,
  map,
  mapValues,
  orderBy,
  sortBy,
  take,
  uniq
} from 'lodash-es';
import {
  categoryColours,
  endpointColour,
  levelColours
} from '../lib/colours.js';

export const release = writable({
  release: '',
  spec: '',
  release_date: new Date(),
  endpoints: [],
  tests: []
});

// Based on url query params, any filters being set.
export const activeFilters = writable({
  test_tags: [],
  hide_tested: "false",
  hide_conf_tested: "false",
  hide_untested: "false",
  useragent: '',
  tests_match: '',
  test_tags_match: '',
  level: '',
  category: '',
  endpoint: ''
});

// holds information on when user mouse is hovering over part of sunburst
export const mouseOverPath = writable([]);

export const breadcrumb = derived(
  [activeFilters, mouseOverPath],
  ([$active, $mouse], set) => {
    let mouseCrumbs = $mouse.map(m => m.data.name);
    let activeAndMouseCrumbs = compact(uniq([$active.level, $active.category, $active.endpo8, ...mouseCrumbs]));
    let crumbs = [];
    // if length is 4, it means we are zoomed into an endpoint, and hovering over a different endpoint.
    if (activeAndMouseCrumbs.length === 4) {
      // if that's the case, we want to show the one we are hovered on.
      crumbs = activeAndMouseCrumbs.filter(crumb => crumb !== $active.endopint);
    } else {
      crumbs = take(compact(uniq([$active.level, $active.category, $active.endpoint, ...mouseCrumbs])), 3);
    }
    set(crumbs);
  }
);

export const endpoints = derived(release, ($rel, set) => set($rel.endpoints));

export const groupedEndpoints = derived(endpoints, ($eps, set) => {
  if ($eps.length > 0) {
    let epsByLevel = groupBy($eps, 'level');
    set(mapValues(epsByLevel, epsInLevel => {
      let epsByCategory = groupBy(epsInLevel, 'category');
      return mapValues(epsByCategory, epsInCategory => {
        return epsInCategory.map (ep => {
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
    if (category) {
      let sunburstAtLevel = $sunburst.children.find(child => child.name === level);
      let sunburstAtCategory = sunburstAtLevel.children.find(child => child.name === category);
      set(sunburstAtCategory);
    } else if (!category && level) {
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
