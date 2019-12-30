import { writable, derived } from 'svelte/store';
import { keyBy } from 'lodash-es';

export const endpoints = writable([]);

export const opIDs = derived(endpoints, ($ep, set) => {
    if ($ep.length > 0) {
        set(keyBy($ep, 'operation_id'));
    } else {
        set([]);
    }
});
