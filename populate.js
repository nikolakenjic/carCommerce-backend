import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Car from './models/CarModel.js';

try {
  await mongoose.connect(process.env.MONGO_URL);

  const jsonCars = JSON.parse(
    await readFile(new URL('./CAR_DATA.json', import.meta.url))
  );

  await Car.create(jsonCars);
  console.log('Success');
  process.exit(0);
} catch (err) {
  console.log(err);
  process.exit(1);
}
