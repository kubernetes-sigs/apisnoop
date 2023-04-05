 import {
   RELEASES_URL,
 } from './constants.js';

export async function releaseJsonExists (releases) {
   const asyncFilter = async (arr, predicate) => {
     const results = await Promise.all(arr.map(predicate));
     return arr.filter((_v, index) => results[index]);
   }

   const releasesWithJson = await asyncFilter(releases, async ({version}) => {
     let res = await fetch(`${RELEASES_URL}/${version}.json`);
     return res.ok;
   });
   return releasesWithJson;
 };
