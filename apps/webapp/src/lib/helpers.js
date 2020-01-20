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

export const toBoolean = (str) => {
    str = str.toString().toLowerCase();
    let truths = ["true", "t", "yes", "1", "truth"]
    return truths.includes(str)
}

export const isValidRegex = (regex) => {
    try {
        new RegExp(regex);
    } catch (e) {
        return false;
    }
    return true;
};

export const hitByMatchingItems = (items, key,  regex, endpoint) => {
    // given an array of objects, items, a key to compare, and the regex to match.
    // return true if endpoint is hit by any item whose key value matches the regex.
    regex = new RegExp(regex);
    let matchingItems = items.filter(ua => regex.test(ua[key]));
    let endpointsHitByItems = uniq(flatten(matchingItems.map(item => item.operation_ids)));
    return endpointsHitByItems.includes(endpoint.operation_id);
};

export const hitByMatchingTestTags = (tests, regex, endpoint) => {
    // given an array of tests, each containing an array of test_tags, and the regex to match.
    // filter tests by those with at least one tag that matches regex filter.
    // return true if endpoint is hit by any of these filtered tests.
    regex = new RegExp(regex);
    let matchingTests = tests.filter(test => test.test_tags.some((tag) => regex.test(tag)));
    let endpointsHitByTests = uniq(flatten(matchingTests.map(test => test.operation_ids)));
    return endpointsHitByTests.includes(endpoint.operation_id);
};
