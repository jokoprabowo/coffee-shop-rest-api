import * as path from 'node:path';
import * as fs from 'node:fs';
import dotenv from 'dotenv';
import ms from 'ms';

if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '../../../..', `.env.${process.env.NODE_ENV || 'development'}`);

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded environment from ${envPath}`);
  } else {
    console.warn(`⚠️ No environment file found at ${envPath}`);
  }
}

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  WHITELIST_ORIGINS: process.env.WHITELIST_ORIGINS?.split(','),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMIN_EMAILS: process.env.WHITELIST_ADMIN_EMAILS?.split(','),
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
};

export default config;
