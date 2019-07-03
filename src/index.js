const {
  prisma
} = require('./generated/prisma-client');
const {
  GraphQLServer
} = require('graphql-yoga');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuditLog = require('./resolvers/AuditLog');
const Endpoint = require('./resolvers/Endpoint');
const Test = require('./resolvers/Test');

const resolvers = {
  Query,
  Mutation,
  AuditLog,
  Endpoint,
  Test
};

const server = new GraphQLServer({
  typeDefs: `src/schema.graphql`,
  resolvers,
  context: request => {
    return {
      ...request,
      prisma
    };
  }
});

server.start(() => console.log('server started on port 4000, baby'));
