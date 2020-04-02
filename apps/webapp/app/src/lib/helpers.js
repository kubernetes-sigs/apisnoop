import {
  forEach,
  trimEnd,
  groupBy,
  mapValues,
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

export const determineBucketAndJob = (bucketsAndJobs, bucketParam, jobParam) => {
  let bucket;
  let job;
  let buckets = groupBy(bucketsAndJobs, 'bucket');
  let bj = mapValues(buckets, (allJobs) => {
    let jobs = allJobs
        .sort((a,b) => new Date(b.job_timestamp) > new Date(a.job_timestamp))
        .map(j => ({job: j.job, timestamp: j.job_timestamp}));
    let [latestJob] = allJobs.map(j => ({job: j.job, timestamp: j.job_timestamp}));
    return {
      latestJob,
      jobs
    };
  });

  let releaseBlocking = 'ci-kubernetes-e2e-gci-gce';
  let defaultBucket = Object.keys(bj).includes(releaseBlocking)
      ? releaseBlocking
      : Object.keys(bj)[0];
  let defaultJob = bj[defaultBucket]['latestJob'].job;

  if (!bucketParam) {
    bucket = defaultBucket;
    job = defaultJob;
  } else if (bucketParam && !jobParam) {
    bucket = isValidBucket(bucketParam, bj)
      ? bucketParam
      : defaultBucket;
    job = bj[bucket]['latestJob'].job
  } else {
    bucket = isValidBucket(bucketParam, bj)
      ? bucketParam
      : defaultBucket;
    job = isValidJob(bj[bucket], jobParam)
      ? jobParam
      : bj[bucket]['latestJob'].job
  }
  return {
    bucket,
    job
  };
}

function isValidBucket (bucket, bjs) {
  return Object.keys(bjs).includes(bucket);
}

function isValidJob  (bucket, job) {
  let jobs = bucket.jobs.map(job => job.job);
  return jobs.includes(job);
}

// SemverString Number -> SemVerString
// SemverString : Numbers separated by points, representing a software release
// Given SemverString s and number n, return string of n level specificity
export const releasePrecision = (s , n) => s.split('.').slice(0,n).join('.');
