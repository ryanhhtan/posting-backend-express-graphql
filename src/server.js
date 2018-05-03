import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import { typeDefs, rootValue } from './graphql';

// Get access env variables defined in .env file by dotenv 
dotenv.config();

// Create an express instance
const server = express();  
const port = process.env.PORT;
const db_uri = process.env.DB_URI; 
//console.log(db_uri);

// Setup mongoose connection
mongoose.connect(db_uri);

const schema = buildSchema(typeDefs);

// console.log(rootValue);

server.get('/', (req, res)=>{
  res.send("hello");
});

server.use('/graphql', graphqlHTTP({
  schema,
  rootValue
}));

server.listen(port, ()=>{
  console.log(`server is running on port ${ port }`);
});
