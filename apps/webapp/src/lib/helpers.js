import {
    forEach,
    trimEnd,
    trimStart
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
