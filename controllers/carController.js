import { StatusCodes } from 'http-status-codes';
import Car from '../models/CarModel.js';

// Get All Cars
export const getAllCars = async (req, res, next) => {
  const { search, startYear, endYear, startPrice, endPrice, sort } = req.query;

  const queryObject = {};

  if (search) {
    queryObject.$or = [
      { make: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
    ];
  }

  if (startYear && endYear) {
    queryObject.year = {
      $gte: parseInt(startYear),
      $lte: parseInt(endYear),
    };
  } else if (startYear) {
    queryObject.year = {
      $gte: parseInt(startYear),
    };
  } else if (endYear) {
    queryObject.year = {
      $lte: parseInt(endYear),
    };
  }

  if (startPrice && endPrice) {
    queryObject.price = {
      $gte: parseInt(startPrice),
      $lte: parseInt(endPrice),
    };
  } else if (startPrice) {
    queryObject.price = {
      $gte: parseInt(startPrice),
    };
  } else if (endPrice) {
    queryObject.price = {
      $lte: parseInt(endPrice),
    };
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    highestPrice: '-price',
    lowestPrice: 'price',
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // Setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const cars = await Car.find(queryObject)
    .sort(sortKey)
    .limit(limit)
    .skip(skip);

  if (!cars || cars.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'No cars found for the user' });
  }

  const totalCars = await Car.countDocuments(queryObject);

  const numOfPages = Math.ceil(totalCars / limit);

  if (page > numOfPages) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Page not found' });
  }

  res.status(200).json({ totalCars, numOfPages, cars });
};

// Created Car
export const createCar = async (req, res, next) => {
  req.body.createdBy = req.user.userId;
  const car = await Car.create(req.body);

  res.status(StatusCodes.CREATED).json({ car });
};

// Get Single Car
export const getSingleCar = async (req, res, next) => {
  const { id } = req.params;

  const car = await Car.findOne({ _id: id });

  res.status(StatusCodes.OK).json({ car });
};

// Get All my Cars
export const getMyCars = async (req, res, next) => {
  const { username } = req.user;
  const cars = await Car.find({ createdBy: req.user.userId });

  if (!cars || cars.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'No cars found for the user' });
  }

  const totalMyCars = await Car.countDocuments({ createdBy: req.user.userId });

  res.status(StatusCodes.OK).json({ totalMyCars, username, cars });
};

// Update Single Car
export const editMySingleCar = async (req, res, next) => {
  const { id } = req.params;

  const car = await Car.findOne({ _id: id });

  if (req.user.userId !== car.createdBy.toString()) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'You can only edit cars that you created' });
  }

  const updateCar = await Car.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ msg: 'Updated Car', car: updateCar });
};

// Delete Car
export const deleteMyCar = async (req, res, next) => {
  const { id } = req.params;

  const car = await Car.findOne({ _id: id });

  if (req.user.userId !== car.createdBy.toString()) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'You can only delete cars you created' });
  }

  await Car.findOneAndDelete({ _id: id });

  res.status(StatusCodes.OK).json({ msg: 'Success, Delete Car' });
};
