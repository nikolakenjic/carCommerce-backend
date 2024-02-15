import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import {
  validateUserLogin,
  validateUserRegister,
} from '../middleware/validatorMiddleware.js';

const router = Router();

router.post('/register', validateUserRegister, register);

router.post('/login', validateUserLogin, login);

router.get('/logout', logout);

export default router;
