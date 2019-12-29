import { writable, derived } from 'svelte/store';

export const endpoints = writable([]);

export const opIDs = derived(endpoints, ($ep, set) => {
    if ($ep.length > 0) {
        set($ep.map(ep => ep.operation_id));
    } else {
        set([]);
    }
});
