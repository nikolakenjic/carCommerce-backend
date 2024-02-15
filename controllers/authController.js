import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePassword, hashedPassword } from '../utils/passwordCrypted.js';
import { createJWT } from '../utils/tokenUtils.js';

// REGISTER ******************************************************************
export const register = async (req, res, next) => {
  const hashPw = await hashedPassword(req.body.password);

  req.body.password = hashPw;

  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ user });
};

// LOGIN USER ****************************************************************
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  // Check validation
  const isValidateUser =
    user && (await comparePassword(password, user.password));

  if (!isValidateUser) {
    return res.status(404).json({ msg: 'User not Found' });
  }

  const token = createJWT({ userId: user._id, username: user.username });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.OK).json({ msg: 'User successfully login!' });
};

// LOGOUT USER ***************************************************************
export const logout = async (req, res, next) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
