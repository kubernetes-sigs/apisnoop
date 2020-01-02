import { writable, derived } from 'svelte/store';
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
