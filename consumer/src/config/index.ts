import * as path from 'node:path';
import * as fs from 'node:fs';
import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  const isDev = process.env.NODE_ENV === 'development';
  const envPath = path.resolve(__dirname, '../../..', isDev ? '.env.development' : '.env.production');

  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    console.log(`✅ Loaded environment from ${envPath}`);
  } else {
    console.warn(`⚠️ No environment file found at ${envPath}`);
  }
}

const configuration = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
};

export default configuration;
