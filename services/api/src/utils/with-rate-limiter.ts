import { RequestHandler } from 'express';
import config from '../config';

export const withRateLimiter = (limiter: RequestHandler): RequestHandler => (req, res, next) => {
  if (config.NODE_ENV === 'test') {
    return next();
  }
  return limiter(req, res, next);
};
