// apisnoop auditlogger
const connectionString = typeof process.env.PG_CONNECTION_STRING !== 'undefined' ? process.env.PG_CONNECTION_STRING : 'postgres://apisnoop:s3cretsauc3@postgres/apisnoop?sslmode=disable'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const knex = require('knex')({
    client: 'pg',
    connection: connectionString
})

console.log(`[status] using connection string: ${connectionString}`)

function hello (req, res, next) {
    const helloMsg = 'Hey! I\'m your friendly neighbourhood auditlogger. Note: the endpoint /events is where logging takes place.'
    console.log(helloMsg)
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
    console.log(req.headers['user-agent'])
    if (req.headers['user-agent'] !== 'kube-apiserver-admission') {
        console.log('[error] request didn\'t come from kube-apiserver')
        return requestFailure(req, res, next, 'Error: request must come from Kubernetes apiserver')
    }
    return next()
}

function logEventsToDB (req, res, next) {
    const requestContent = req.body
    const items = requestContent.items[0]

    console.log(JSON.stringify(requestContent, null, 2))

    console.log('[status] inserting into database')
    var dataToInsert = {
         bucket: 'apisnoop',
         job: 'live', 
         audit_id: items.auditID,
         stage: items.stage, 
         event_verb: items.verb,
         request_uri: items.requestURI,
         data: JSON.stringify(requestContent)
    }
    console.log(dataToInsert)

    knex.transaction((trx) => {
         knex('live_audit_event').transacting(trx).insert(dataToInsert)
             .then(trx.commit)
             .catch(trx.rollback)
    }).then(resp => {
        console.log('[status] successfully submitted entry')
        res.json({ message: 'operation complete; data inserted' })
        return res.end()
    }).catch(err => {
        console.log('[error] database: ${err}')
        requestFailure(req, res, next, '[error] database: ${err}')
    })
}

console.log('[status] starting apisnoop-auditlog-event-handler')

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(morgan('combined'))

app.get('/', hello)
app.post('/events', [checkForBodyContent, checkUserAgent], logEventsToDB)

knex.raw('select 0;').then(() => {
    console.log('[status] connected to database')
    app.listen('9900', () => {
        console.log('[status] started; listening on port 9900')
    })

}).catch(err => {
    console.log('[error] No database connection found.')
    console.log(err)
    process.exit(1)
})
