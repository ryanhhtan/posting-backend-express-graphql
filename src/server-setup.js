import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

import { typeDefs, rootValue } from './graphql';
import { extractAuthenticatedUser } from './authentication';
import cors from 'cors';

const startServer = async() => {
  // Create an express instance
  const app = express();
  const port = process.env.NODE_ENV === 'test'
    ? process.env.TEST_PORT : process.env.PORT;
  const dbUri = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URI : process.env.DB_URI;

  // Setup mongoose connection
  await mongoose.connect(dbUri);

  // Build GraphQL schema
  const schema = buildSchema(typeDefs);

  // Extract authenticated user from JWT
  app.use(extractAuthenticatedUser);

  // A simple message showing the app is running.
  app.get('/', (req, res) => {
    res.send('hello');
  });

  app.use('/graphql', cors(), graphqlHTTP((req, res) => ({
    schema,
    rootValue,
    context: {
      userId: req.authUserId,
    },
  })));

  app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  });
};

export default startServer;


