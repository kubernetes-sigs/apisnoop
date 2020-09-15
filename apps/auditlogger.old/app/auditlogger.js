const connectionString = typeof process.env.APP_DB_CONNECTION_STRING !== 'undefined' ? process.env.APP_DB_CONNECTION_STRING : 'postgres://apisnoop:apisnoop@postgres/apisnoop?sslmode=disable'
const auditTableName = typeof process.env.APP_DB_AUDIT_EVENT_TABLE !== 'undefined' ? process.env.APP_DB_AUDIT_EVENT_TABLE : 'audit_event'
const appPort = typeof process.env.APP_PORT !== 'undefined' ? process.env.APP_PORT : '9900'
const appDisableLogs = typeof process.env.APP_DISABLE_LOGS !== 'undefined' ? process.env.APP_DISABLE_LOGS : 'false'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const knex = require('knex')({
    client: 'pg',
    connection: connectionString
})

var postgresIsReady = false

console.log(`[status] using connection string: ${connectionString}`)

function logs(...messages) {
    if (appDisableLogs == 'true') {
        return
    }
    console.log(...messages)
}

function hello (req, res, next) {
    const helloMsg = 'Hey! I\'m your friendly neighbourhood auditlogger. Note: the endpoint /events is where logging takes place.'
    res.json({ message: helloMsg })
    return res.end()
}

function requestFailure (req, res, next, message) {
    res.status(400)
    res.json({ message })
    return res.end()
}

function checkForBodyContent (req, res, next) {
    if (Object.keys(req.body).length === 0 || typeof req.body !== 'object') {
        console.log('[error] request contains no body')
        return requestFailure(req, res, next, 'request must contain a body')
    }
    return next()
}

function checkUserAgent (req, res, next) {
    const requestContent = req.body
    if (req.headers['user-agent'] !== 'kube-apiserver-admission') {
        console.log('[error] request didn\'t come from kube-apiserver')
        return requestFailure(req, res, next, 'Error: request must come from Kubernetes apiserver')
    }
    return next()
}

function postgresReadyCheck (req, res, next) {
    if (postgresIsReady === true) {
        return next()
    }
    console.log('[status] postgres is unready')
    knex.raw(`SELECT to_regclass('${auditTableName}');`).then(resp => {
        postgresIsReady = resp.rows[0].to_regclass !== null
        return next()
    })
}

function logEventToDB (event) {
    // set each relevant part of data load to a variable, for easier insertion statement into db below
    const {
        auditID,
        stage,
        verb,
        requestURI,
        level,
        apiVersion,
        userAgent,
        user,
        objectRef,
        sourceIPs,
        annotations,
        requestObject,
        responseObject,
        responseStatus,
        stageTimestamp,
        requestReceivedTimestamp
    } = event

    // regex for useragent, to determine if a test or conformance test hit
    const STARTS_WITH_E2E = new RegExp('^e2e.test')
    const HAS_CONF_IN_BRACKETS = new RegExp('\\[Conformance\\]')

    logs('[status] inserting into database')
    let dataToInsert = {
        bucket: 'apisnoop',
        job: 'live',
        audit_id: auditID,
        stage,
        event_verb: verb,
        request_uri: requestURI,
        event_level: level,
        api_version: apiVersion,
        useragent: userAgent,
        test_hit: STARTS_WITH_E2E.test(userAgent),
        conf_test_hit: HAS_CONF_IN_BRACKETS.test(userAgent),
        event_user: user,
        object_namespace: objectRef ? objectRef.namespace : null,
        object_type: objectRef ? objectRef.resource : null,
        object_group: objectRef ? objectRef.apiGroup : null,
        object_ver: objectRef ? objectRef.apiVersion : null,
        source_ips: JSON.stringify(sourceIPs),
        annotations: JSON.stringify(annotations),
        request_object: JSON.stringify(requestObject),
        response_object: JSON.stringify(responseObject),
        response_status: JSON.stringify(responseStatus),
        stage_timestamp: stageTimestamp,
        request_received_timestamp: requestReceivedTimestamp,
        data: JSON.stringify(event)
    }
    logs("Inserting:", dataToInsert.event_verb, dataToInsert.request_uri, dataToInsert.bucket, dataToInsert.job, dataToInsert.useragent)

    knex.transaction((trx) => {
        knex(`${auditTableName}`).transacting(trx).insert(dataToInsert)
            .then(trx.commit)
            .catch(trx.rollback)
    }).then(resp => {
        logs('[status] successfully submitted entry')
        return { success: true, err: null }
    }).catch(err => {
        console.log(`[error] database: ${err}`)
        return { success: false, err }
    })
}

function logEventsToDB (req, res, next) {
    const requestContent = req.body
    const items = requestContent.items

    var results = items.map((event, index) => {
        console.log(`Request [${index}/${items.length}]:`, event.requestURI, event.userAgent)
        return logEventToDB(event)
    })
    if (results.some(r => r.success === false)) {
        let errs = results
            .filter(r => r.success === false)
            .map(e => e.err);
        return requestFailure(req, nes, next, errs)
    }
    res.json({ message: 'operation complete; data inserted' })
    return res.end()
}

console.log('[status] starting apisnoop-auditlog-event-handler')

app.use(bodyParser.json({
  extended: true,
  limit: '100mb'
}))
app.use(express.json())
app.use(morgan('combined'))

app.get('/', hello)
app.post('/events', [checkForBodyContent, postgresReadyCheck], logEventsToDB)

knex.raw('select 0;').then(() => {
    console.log('[status] connected to database')
    app.listen(appPort, () => {
        console.log(`[status] started; listening on port ${appPort}`)
    })
}).catch(err => {
    console.log('[error] No database connection found.')
    console.log(err)
    process.exit(1)
})
