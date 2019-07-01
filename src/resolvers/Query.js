function auditLogs (parent, args, context, index)  {
    return context.prisma.auditLogs();
};

module.exports = {
    auditLogs
};
