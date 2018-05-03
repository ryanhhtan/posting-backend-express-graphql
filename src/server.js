import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Get access env variables defined in .env file by dotenv 
dotenv.config();

// Create an express instance
const server = express();  
const port = process.env.PORT;
const db_uri = process.env.DB_URI; 
//console.log(db_uri);

// Setup mongoose connection
mongoose.connect(db_uri);

server.get('/', (req, res)=>{
  res.send("hello");
});

server.listen(port, ()=>{
  console.log(`server is running on port ${port}`);
});
