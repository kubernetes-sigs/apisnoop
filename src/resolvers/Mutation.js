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
    timestamp: args.timestamp,
    endpoints: []
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

module.exports = {
  createAuditLog,
  createEndpoint
};
