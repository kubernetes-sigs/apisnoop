function auditLogs (parent, args, context, index)  {
  return context.prisma.auditLogs();
};

function endpoints (parent, args, context, index) {
  return context.prisma.endpoints();
}

module.exports = {
  auditLogs,
  endpoints
};
