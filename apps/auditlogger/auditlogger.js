import express from 'npm:express@4.18.2'
import morgan from 'npm:morgan@1.10.0'
import knexjs from 'npm:knex@3.1.0'
import bodyParser from 'npm:body-parser@1.20.2'
import pg from 'npm:pg@8.12.0'

const connectionString = typeof Deno.env.APP_DB_CONNECTION_STRING !== 'undefined' ? Deno.env.APP_DB_CONNECTION_STRING : 'postgres://apisnoop:apisnoop@snoopdb/apisnoop?sslmode=disable'
const auditTableName = typeof Deno.env.APP_DB_AUDIT_EVENT_TABLE !== 'undefined' ? Deno.env.APP_DB_AUDIT_EVENT_TABLE : 'testing.audit_event'
const appPort = typeof Deno.env.APP_PORT !== 'undefined' ? Deno.env.APP_PORT : '9900'
const appDisableLogs = typeof Deno.env.APP_DISABLE_LOGS !== 'undefined' ? Deno.env.APP_DISABLE_LOGS : 'false'
const app = express()
const knex = knexjs({
    client: 'pg',
    connection: connectionString
})

var postgresIsReady = false

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
    const {
        auditID,
        userAgent
    } = event

    // regex for useragent, to determine if a test or conformance test hit
    const STARTS_WITH_E2E = new RegExp('^e2e.test')
    const HAS_CONF_IN_BRACKETS = new RegExp('\\[Conformance\\]')

    logs('[status] inserting into database')
    let dataToInsert = {
        release: 'live',
        release_date: Date.now().toString(),
        audit_id: auditID,
        useragent: userAgent,
        test: userAgent,
        test_hit:  STARTS_WITH_E2E.test(userAgent),
        conf_test_hit: HAS_CONF_IN_BRACKETS.test(userAgent),
        data: JSON.stringify(event),
        source: 'live'
    }
    logs("Inserting:", dataToInsert.useragent)

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

function main() {
    console.log(`[status] using connection string: ${connectionString}`)
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
        Deno.exit(1)
    })
}

main()
