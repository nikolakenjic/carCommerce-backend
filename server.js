import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';

const app = express();

import { connectDB } from './mongoDB/connect.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';

// Morgan use us to see CRUD operations and status codes
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/cars', carRoutes);

// Errors
app.use('*', (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not Found Route or Page' });
});
app.use(errorHandlerMiddleware);

const port = process.env.PORT;

// Connect and running on a server
try {
  await connectDB(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server is running on a port ${port}`);
  });
} catch (err) {
  console.log(err);
  process.exit(1);
}
