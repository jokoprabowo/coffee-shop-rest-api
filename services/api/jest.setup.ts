import { redis, pool } from '@project/shared';
import { encryptInput } from './src/utilities/encrypt';

jest.setTimeout(30000);
let adminId: number;
let userId: number;

beforeAll(async () => {
  userId = await pool.query('insert into users (email, password, fullname, phone, address, is_verified)' +
    ' values ($1, $2, $3, $4, $5, $6) returning id', [
    'testexample@mail.com',
    await encryptInput('Example!test123'),
    'Test Example',
    '081234567890',
    'Test street, Example, 00000',
    true,
  ]).then(res => res.rows[0].id);

  adminId = await pool.query('insert into users (email, password, fullname, phone, address, role, is_verified)' +
    ' values ($1, $2, $3, $4, $5, $6, $7) returning id', [
    'adminexample@mail.com',
    await encryptInput('Example!test123'),
    'Test Example',
    '081234567890',
    'Test street, Example, 00000',
    'admin',
    true,
  ]).then(res => res.rows[0].id);
});

afterAll(async () => {
  await pool.query('delete from users where id = $1', [userId]);
  await pool.query('delete from users where id = $1', [adminId]);

  await redis.quit();
  await pool.end();
});