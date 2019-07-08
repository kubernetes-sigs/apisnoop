async function events (parent, args, context, index) {
  const events = await context.prisma.events();
  return events
};

module.exports = {
  events
};
