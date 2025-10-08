import dotenv from 'dotenv';
import ms from 'ms';
dotenv.config();

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  WHITELIST_ORIGINS: process.env.WHITELIST_ORIGINS?.split(','),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMIN_EMAILS: process.env.WHITELIST_ADMIN_EMAILS?.split(','),
  REDIS_SERVER: process.env.REDIS_SERVER,
};

export default config;
