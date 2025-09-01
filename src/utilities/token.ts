import jwt from 'jsonwebtoken';
import config from '../config';

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, config.JWT_ACCESS_SECRET!);
  } catch (err) {
    console.log(err);
    throw new Error('Invalid access token!');
  }
};
