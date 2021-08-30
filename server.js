const { ApolloServer } = require('apollo-server');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

connectDb()
  .then(() => server.listen({ port: process.env.PORT || 5000 }))
  .then(({ url }) => console.log(`server running on ${url}`))
  .catch((err) => console.error(err));
