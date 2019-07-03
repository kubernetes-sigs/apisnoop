function createAuditLog (root, args, context) {
  return context.prisma.createAuditLog({
    job: args.job,
    bucket: args.bucket,
    version: args.version,
    jobVersion: args.version,
    masterOsImage: args.masterOsImage,
    infraCommit: args.infraCommit,
    nodeOsImage: args.nodeOsImage,
    pod: args.pod,
    passed: args.passed,
    result: args.result,
    timestamp: args.timestamp
  });
};

function createEndpoint (root, args, context) {
  return context.prisma.createEndpoint({
    auditLog: { connect: { id: args.auditLogID } },
    operationID: args.operationID,
    level: args.level,
    category: args.category,
    kind: args.kind,
    group: args.group,
    description: args.description,
    version: args.version,
    path: args.path,
    hits: args.hits,
    testHits: args.testHits,
    conformanceHits: args.conformanceHits,
    isDeprecated: args.isDeprecated
  });
}

function createTest (root, args, context) {
  return context.prisma.createTest({
    auditLog: { connect: { id: args.auditLogId } },
    name: args.name,
    endpoints: { connect: args.endpoints.map(opID => {
      return {
          operationID: opID,
          auditLog: { connect: {id: args.auditLogID} }
      }
    })}
  })
}

module.exports = {
  createAuditLog,
  createEndpoint,
  createTest
};
