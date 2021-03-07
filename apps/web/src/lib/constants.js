const branch = process.env.BRANCH;

console.log({ branch: `https://raw.githubusercontent.com/cncf/apisnoop/${branch}/resources/coverage`});
export const RELEASES_URL = branch
  ? `https://raw.githubusercontent.com/cncf/apisnoop/${branch}/resources/coverage`
  : 'https://raw.githubusercontent.com/cncf/apisnoop/master/resources/coverage';
export const RELEASES = [
  '1.21.0',
  '1.20.0',
  '1.19.0',
  '1.18.0',
  '1.17.0',
  '1.16.0',
  '1.15.0'
];
