import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utilities/token';

describe('Delete user account endpoint.', () => {
  let userId: number;
  let token: string;
  // let cookie: string;

  beforeAll(async () => {
    userId = await pool.query('insert into users (email, password, fullname, phone, address, is_verified)' +
    ' values ($1, $2, $3, $4, $5, $6) returning id', [
      'testuser@mail.com',
      'Example!test123',
      'Test Example',
      '081234567890',
      'Test street, Example, 00000',
      true,
    ]).then(res => res.rows[0].id);
    token = generateAccessToken(userId);
    // cookie = res.headers['set-cookie'];
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return a 200 status code if user successfully deleted', async () => {
    const response = await request(app).delete('/api/v1/users/delete')
      .set('Authorization', `Bearer ${token}`);
      // .set('Cookie', cookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User has been deleted!');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).delete('/api/v1/users/delete');
    // .set('Cookie', cookie);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const fakeToken = generateAccessToken(-1);
    const response = await request(app).delete('/api/v1/users/delete')
      .set('Authorization', `Bearer ${fakeToken}`);
      // .set('Cookie', cookie);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});