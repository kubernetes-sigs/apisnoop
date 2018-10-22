/* eslint-disable no-unused-vars */
const request = require('request-promise')
const yaml = require('js-yaml')
const fs = require('fs')

// hi.
var options = {
    url: 'https://api.github.com/repos/kubernetes/test-infra/git/blobs/66c3f57e899a92afc9f6fca20387220a65312915',
    headers: {
        'User-Agent': 'request'
    }
}
//location of sunburst jsons
var dir = './jsons/sunbursts'

class service {
    constructor (options) {
        this.options = options || {};
    }

    async setup (app, params) {
        populateSunburst(app, dir)
       // request(options).then(blob => {
        //    blob = JSON.parse(blob)
       //     var content = Buffer.from(blob.content, 'base64').toString()
       //     var configGroups =  yaml.safeLoad(content)
       //     distribute(app, configGroups)
      //  })
    }
}

    function distribute (app, configFile) {
        var relevantSections = ['dashboards', 'test_groups', 'dashboard_groups']
        for (var section of relevantSections) {
            var configSection = configFile[section]
            var service = app.service(`/api/v1/${section}`)
            populate(service, configSection)
        }
    }
    
    
    async function populateSunburst (app, dir) {
        var sunbursts = fs.readdirSync(dir)
        for (var sunburst of sunbursts) {
            fs.readFile(`${dir}/${sunburst}`, 'utf-8', (err, data) => {
                if (err) console.log({read_file_err: err})
                addToSunburst(app, sunburst, data)
            })
        }
    }
    
    async function addToSunburst (app, sunburst, data) {
        var service = app.service('/api/v1/sunbursts')
        var json = JSON.parse(data)
        var existingEntry = await service.find({query:{name: sunburst}})
        if (existingEntry.length === 0) {
            service.create({name: sunburst, data: json})
            console.log(`sunburst made for: ${sunburst}`)
        } else {
            service.update(existingEntry[0]._id, {name: sunburst, data: json})
            console.log(`sunburst updated for: ${sunburst}`)
        }
    }
    

module.exports = function (options) {
    return new service(options);
};

module.exports.service = service;
