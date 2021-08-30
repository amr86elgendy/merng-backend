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

const PORT = process.env.port || 5000;

connectDb()
  .then(() => server.listen({ port: PORT }))
  .then(({ url }) => console.log(`server running on ${url}`))
  .catch((err) => console.error(err));
