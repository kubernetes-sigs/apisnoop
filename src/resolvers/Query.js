function auditLogs (parent, args, context, index)  {
  return context.prisma.auditLogs();
};

async function endpoints (parent, args, context, index) {
  const where = args.operationID ? {
      operationID_contains: args.operationID
    } : {}

  const endpoints = await context.prisma.endpoints({
    where
  });

  return endpoints;
};

async function feed(parent, args, context, info) {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {}

  const links = await context.prisma.links({
    where
  })
  return links
}

module.exports = {
  auditLogs,
  endpoints
};
