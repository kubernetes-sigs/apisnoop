const {
  prisma
} = require('./generated/prisma-client');
const {
  GraphQLServer
} = require('graphql-yoga');

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')

const resolvers = {
  Query,
  Mutation
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
