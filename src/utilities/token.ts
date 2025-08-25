import jwt from 'jsonwebtoken';
import config from '../config';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(userId, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(userId, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
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

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET!);
  } catch (err) {
    console.log(err);
    throw new Error('Invalid refresh token!');
  }
};
