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

module.exports = {
  createAuditLog
};
