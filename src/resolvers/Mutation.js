function createEvent (root, args, context) {
  return context.prisma.createEvent({
    level: args.level,
    stage: args.stage,
    requestURI: args.requestURI,
    verb: args.verb,
    user: { create: {
      username: args.user.username,
      groups: {set: [...args.user.groups]}
    } },
    annotations: args.annotations,
    apiVersion: args.apiVersion,
    auditID: args.auditID,
    kind: args.kind,
    objectRef: args.objectRef,
    requestReceivedTimestamp: args.requestReceivedTimestamp,
    responseStatus: args.responseStatus,
    sourceIPs: { set: [...args.sourceIPs ] },
    stageTimestamp: args.stageTimestamp,
    userAgent: args.userAgent
  });
}

module.exports = {
  createEvent
};
