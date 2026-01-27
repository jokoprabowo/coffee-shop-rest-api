import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utilities/token';

describe('Get user details endpoint.', () => {
  let userId: number;
  let token: string;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    token = generateAccessToken(userId);
  });

  it('Should return a 200 status code and user data.', async () => {
    const response = await request(app).get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('user');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).get('/api/v1/users/profile');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });
});