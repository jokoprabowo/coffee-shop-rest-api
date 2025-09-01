import { Pool } from 'pg';
import config from '.';

const pool = new Pool({
  host: config.DB_HOST,
  port: Number(config.DB_PORT),
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
