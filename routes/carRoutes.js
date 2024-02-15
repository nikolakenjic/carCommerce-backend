import { Router } from 'express';
import {
  getAllCars,
  createCar,
  getSingleCar,
  editMySingleCar,
  deleteMyCar,
  getMyCars,
} from '../controllers/carController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
  validateCreateCar,
  validateParams,
} from '../middleware/validatorMiddleware.js';

const router = Router();

router.get('/', getAllCars);

router.post('/', authenticateUser, validateCreateCar, createCar);

router.get('/myCars', authenticateUser, getMyCars);

router.get('/:id', authenticateUser, validateParams, getSingleCar);

router.patch(
  '/myCars/:id',
  authenticateUser,
  validateParams,
  validateCreateCar,
  editMySingleCar
);

router.delete('/myCars/:id', authenticateUser, validateParams, deleteMyCar);

export default router;
