const { prisma } = require('./generated/prisma-client')

async function main() {
  // Create a new auditlog
  const newAuditLog = await prisma.createAuditLog({ 
    job: "36092",
    bucket: "ci-kubernetes-e2e-gci-gce",
    version: "v1.15.0-alpha.0.1493",
    jobVersion: "v1.15.0-alpha.0.1493+1cb550295a9314",
    masterOsImage: "cos-beta-73-11647-64-0",
    infraCommit: "279855f78",
    nodeOsImage: "cos-beta-73-11647-64-0",
    pod: "8fa53d0a-4f5a-11e9-8a35-0a580a6c1338",
    passed: true,
    result: "SUCCESS",
    timestamp: 1553561320
  })
  console.log(`Created new log: ${newAuditLog.url} (ID: ${newAuditLog.id})`)

  // Read all auditlogs from the database and print them to the console
  const allLinks = await prisma.AuditLogs()
  console.log(allAuditLogs)
}

main().catch(e => console.error(e))
