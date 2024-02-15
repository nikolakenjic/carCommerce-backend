import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new Error('You must be login to have access this route');
  }

  try {
    const { userId, username } = verifyJWT(token);

    req.user = { userId, username };
    next();
  } catch (err) {
    throw new Error(err);
  }
};
