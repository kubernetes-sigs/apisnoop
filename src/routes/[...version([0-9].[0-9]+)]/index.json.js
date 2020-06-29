import fetch from 'node-fetch';
import yaml from 'js-yaml';
import { releasesURL } from '../../lib/constants.js';
export async function get(req, res, next) {
  let [version] = req.params.version;

  const releaseData = await fetch(`${releasesURL}/${version}.json`)
        .then(response => response.json());

	res.writeHead(200, {
		'Content-Type': 'application/json'
	});
	res.end(JSON.stringify(releaseData));
}
