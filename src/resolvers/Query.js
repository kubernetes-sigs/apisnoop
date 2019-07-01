function feed (parent, args, context, index)  {
    return context.prisma.auditLogs();
};

module.exports = {
    feed
};
