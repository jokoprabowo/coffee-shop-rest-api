import { RequestHandler } from 'express';
import config from '../config';

// export const withRateLimiter = (handler: () => RequestHandler): RequestHandler => (req, res, next) => {
//   if (config.NODE_ENV === 'test') {
//     return next();
//   }
//   return handler()(req, res, next);
// };

export const withRateLimiter = (limiter: RequestHandler): RequestHandler => (req, res, next) => {
  if (config.NODE_ENV === 'test') {
    return next();
  }
  return limiter(req, res, next);
};
