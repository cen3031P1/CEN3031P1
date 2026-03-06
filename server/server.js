import express from 'express';
import dotenv from 'dotenv';
import router from './routes.js';
import {connectDB} from './db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/', router)


connectDB().then(() => {
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  });
});
