function endpoints (parent, args, context) {
  return context.prisma.auditLog({ id: parent.id }).endpoints();
}

module.exports = {
  endpoints
};


