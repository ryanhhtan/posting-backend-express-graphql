import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { typeDefs, rootValue } from './graphql';
import { extractAuthenticatedUser } from './authentication';

const startServer = () => {
  // Create an express instance
  const server = express();
  const port = process.env.NODE_ENV === 'test'
    ? process.env.TEST_PORT : process.env.PORT;
  const dbUri = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URI : process.env.DB_URI;

  // Setup mongoose connection
  mongoose.connect(dbUri);

  // Build GraphQL schema
  const schema = buildSchema(typeDefs);

  // Extract authenticated user from JWT
  server.use(extractAuthenticatedUser);

  // A simple message showing the server is running.
  server.get('/', (req, res) => {
    res.send('hello');
  });

  server.use('/graphql', graphqlHTTP(async(req, res) => ({
    schema,
    rootValue,
    context: {
      userId: req.authUserId,
    },
  })));

  server.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });

  return server;
};

export default startServer;


