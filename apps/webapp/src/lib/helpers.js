import {
    forEach,
    trimEnd,
    trimStart,
    flatten,
    uniq
} from 'lodash-es';

export const updateQueryParams = (page, query) => {
    // given a sapper page store, and new queries
    // construct a url string with old and new queries.
    let newQueries = {
        ...page.query,
        ...query
    };

    let queryStrings = {};
    forEach(newQueries, (v, k) => {
        queryStrings[k] = trimStart(v.reduce((acc, cur) => `${acc}${k}=${cur}&`, ''), '&');
    });

    let queryNames = Object.keys(queryStrings);
    let fullQueryString = trimEnd(queryNames.reduce((acc, cur) => `${acc}${queryStrings[cur]}`, '?'), '&');
    return fullQueryString;
};


export const isValidRegex = (regex) => {
    try {
        new RegExp(regex);
    } catch (e) {
        return false;
    }
    return true;
};

export const hitByMatchingUseragent = (useragents, regex, endpoint) => {
    // return true if endpoint is hit by any useragent
    // in array of useragents, filtered by a regex match.
    regex = new RegExp(regex);
    let matchingUseragents = useragents.filter(ua => regex.test(ua.useragent));
    let endpointsHitByUseragents = uniq(flatten(matchingUseragents.map(ua => ua.operation_ids)));
    return endpointsHitByUseragents.includes(endpoint.operation_id);
};
