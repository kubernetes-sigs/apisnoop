const head = process.env.HEAD;
export const RELEASES_URL = head
  ? `https://raw.githubusercontent.com/cncf/apisnoop/${head}/resources/coverage`
  : 'https://raw.githubusercontent.com/cncf/apisnoop/main/resources/coverage';
// the earliest release we have test data for
export const PENDING_ENDPOINTS_URL = "https://raw.githubusercontent.com/ii/kubernetes/pending_eligible_endpoints/test/conformance/testdata/pending_eligible_endpoints.yaml";
export const INELIGIBLE_ENDPOINTS_URL = "https://raw.githubusercontent.com/ii/kubernetes/pending_eligible_endpoints/test/conformance/testdata/ineligible_endpoints.yaml";
export const EARLIEST_VERSION ='1.15.0';
