const head = process.env.HEAD;
export const RELEASES_URL = head
  ? `https://raw.githubusercontent.com/cncf/apisnoop/${head}/resources/coverage`
  : 'https://raw.githubusercontent.com/cncf/apisnoop/main/resources/coverage';
// the earliest release we have test data for
export const EARLIEST_VERSION ='1.15.0';
