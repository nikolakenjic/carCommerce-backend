import mongoose from 'mongoose';

export const connectDB = (url) => {
  console.log('Connected to DB...');
  return mongoose.connect(url);
};
