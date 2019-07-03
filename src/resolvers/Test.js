function auditLog (parent, args, context) {
  return context.prisma.test({id: parent.id}).auditLog();
}

function endpoints (parent, args, context) {
  return context.prisma.test({id: parent.id}).endpoints();
}

module.exports = {
  auditLog,
  endpoints
}
