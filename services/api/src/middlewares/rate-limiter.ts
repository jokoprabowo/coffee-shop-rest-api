// middlewares/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { RedisReply } from 'rate-limit-redis';
import { redis } from '@project/shared';

export const rateLimiter = (max: number = 100) => rateLimit({
  windowMs: 15 * 60 * 1000,
  max,
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
	  sendCommand: (command: string, ...args: string[]) => redis.call(command, ...args) as Promise<RedisReply>,
  }),

  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests, please try again later!',
    });
  },
});