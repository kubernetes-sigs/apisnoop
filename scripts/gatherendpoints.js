#!/usr/bin/env node

const { request } = require('graphql-request')
const fs = require('fs')

let testruns = [
    "1134962072287711234",
    "1141017488889221121",
    "1145963446211186694",
    "1152045379034812417"
]

async function main(testrun) {
    const endpoint = `https://zzhasura.sharing.io/v1/graphql`;

    const query = /* GraphQL */ `
        query($testrun: String!){
          audit_events(distinct_on: op_id, where: {testrun_id: {_eq: $testrun}, user_agent: {_ilike: "%e2e%"}},order_by: {op_id: asc}) {
              op_id
          }
        }
        
    `
    const variables = {testrun}

    const data = await request(endpoint, query, variables)
    fs.writeFile(`gathered_endpoints/${testrun}.json`, JSON.stringify(data, undefined, 2), (err) => {
        if (err) throw err;
        console.log('saved!!', testrun)
    })
}

testruns.map(testrun => main(testrun).catch(error => console.error(error)))
