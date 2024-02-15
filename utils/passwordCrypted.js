import bcrypt from 'bcryptjs';

export const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(password, salt);

  return hashPwd;
};

export const comparePassword = async (password, hashPwd) => {
  const isMatch = await bcrypt.compare(password, hashPwd);

  return isMatch;
};
