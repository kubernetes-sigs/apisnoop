import fetch from 'node-fetch';
import yaml from 'js-yaml';
import { releasesURL } from '../lib/constants.js';
export async function get(req, res, next) {
  const releases = await fetch(`${releasesURL}/releases.yaml`)
        .then(response => response.text())
        .then(text => yaml.safeLoad(text))
        .then(({releases}) => releases.map(n => n.toString()))// will make it easier to sort and combine in url
        .then(rels => rels.sort((a,b) => b.split(".")[1] - a.split(".")[1]));

  let latest = releases[0];

  const releaseData = await fetch(`${releasesURL}/${latest}.json`)
        .then(response => response.json());

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	res.end(JSON.stringify(releaseData));
}
