const {
  prisma
} = require('./generated/prisma-client');
const {
  GraphQLServer
} = require('graphql-yoga');

// const Query = require('./resolvers/Query')

const typeDefs = `
  type Query {
    info: String! 
  }
`
const resolvers = {
  Query: {
    info: () => `apisnoop v3 server active`
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: request => {
    return {
      ...request,
      prisma
    };
  }
});

server.start(() => console.log('server started on port 4000'));
