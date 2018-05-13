import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { typeDefs, rootValue } from './graphql';
import { extractAuthenticatedUser } from './authentication';

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const startServer = async() => {
  // Create an express instance
  const app = express();
  const port = process.env.NODE_ENV === 'test'
    ? process.env.TEST_PORT : process.env.PORT;
  const dbUri = process.env.NODE_ENV === 'test'
    ? process.env.TEST_DB_URI : process.env.DB_URI;

  // Setup mongoose connection
  mongoose.connect(dbUri);
  // console.log(mongoose.connection);

  // Build GraphQL schema
  const schema = buildSchema(typeDefs);

  // Extract authenticated user from JWT
  app.use(extractAuthenticatedUser);

  // A simple message showing the app is running.
  app.get('/', (req, res) => {
    res.send('hello');
  });

  app.use('/graphql', graphqlHTTP((req, res) => ({
    schema,
    rootValue,
    context: {
      userId: req.authUserId,
    },
  })));

  app.listen(port, () => {
    console.log(`app is listening on port ${port} `);
  });

  // await sleep(3000);
};

export default startServer;


