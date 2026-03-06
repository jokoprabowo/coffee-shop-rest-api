import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { AuthenticationError } from '../exceptions';

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessApi',
  });
};

export const verifyAccessToken = (token: string): JwtPayload|string => {
  try {
    return jwt.verify(token, config.JWT_ACCESS_SECRET!);
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Access token expired!');
    } else {
      throw new AuthenticationError('Invalid access token!');
    }
  }
};
