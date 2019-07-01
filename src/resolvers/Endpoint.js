function auditLog (parent, args, context) {
  return context.prisma.endpoint({id: parent.id}).auditLog();
}

module.exports = {
  auditLog
}
