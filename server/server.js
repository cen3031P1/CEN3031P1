/*
  This is the server file for the application. It sets up the express server and connects to the database.
  Server should be running on port 3001 and the database should be connected before the server starts listening for requests.

  Exports:
  None

  Imports:
  express 

  dotenv - environment variables 

  router - see routes.js for more details

  cors - this is the library used to allow cross-origin requests. This is necessary for the frontend to be able to make requests to the backend.

  connectDB - see db.js for more details.
*/
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import dotenv from 'dotenv';
import router from './routes.js';
import cors from 'cors';
import {connectDB} from './db.js';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3001;

app.use(cors());

//this allows us to parse json in the request body
//frontend req should be json
app.use(express.json());

app.use("/api", router)


connectDB().then(() => {
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  });
});
