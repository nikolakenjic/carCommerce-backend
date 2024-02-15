import { check, body, validationResult, param } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/UserModel.js';
import Car from '../models/CarModel.js';

const validatorWithErrors = (validationValues) => {
  return [
    validationValues,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMsgs = errors.array().map((error) => error.msg);
        console.log('Error message', errorMsgs);

        throw new Error(errorMsgs);
      }
      next();
    },
  ];
};

// USER VALIDATION

// Registration
export const validateUserRegister = validatorWithErrors([
  body('firstName', 'First Name is required').trim().notEmpty(),
  body('lastName', 'Last Name is required').trim().notEmpty(),
  body('username', 'Username is required').trim().notEmpty(),
  body('email', 'Please enter a valid email like: test@test.com')
    .trim()
    .isEmail()
    .custom(async (value) => {
      const userDoc = await User.findOne({ email: value });
      if (userDoc) {
        throw new Error('Email already exist');
      }
    }),
  body('password', 'Password is required')
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 30 })
    .withMessage('Min 6, max 30 character in password field'),
]);

// Login
export const validateUserLogin = validatorWithErrors([
  body('username', 'Username is required').trim().notEmpty(),
  body('email', 'Please enter a valid email like: test@test.com')
    .trim()
    .isEmail(),
  body('password', 'Password is required')
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 30 })
    .withMessage('Min 6, max 30 character in password field'),
]);

// CAR VALIDATION
export const validateCreateCar = validatorWithErrors([
  body('make', 'Car Mark is required').trim().notEmpty(),
  body('model', 'Car Model is required').trim().notEmpty(),
  body('year', 'Car Year is required').trim().notEmpty(),
  body('mileage', 'Car mileage is required').trim().notEmpty(),
  body('fuelType', 'Car fuel type is required').trim().notEmpty(),
]);

// VALIDATE PARAMS
export const validateParams = validatorWithErrors([
  param('id').custom(async (value, { req }) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(value);

    if (!isIdValid) {
      throw new Error('Not Valid ID');
    }

    const car = await Car.findOne({ _id: value });

    if (!car) {
      throw new Error('Not Found car whit that ID');
    }
  }),
]);
