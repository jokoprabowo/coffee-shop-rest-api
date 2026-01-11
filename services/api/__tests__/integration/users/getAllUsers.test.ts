import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utilities/token';

describe('Get all users endpoint.', () => {
  let userId: number;
  let adminId: number;
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    userToken = generateAccessToken(userId);
    adminId = await pool.query('select id from users where email = $1', ['adminexample@mail.com'])
      .then(res => res.rows[0].id);
    adminToken = generateAccessToken(adminId);  
  });

  it('Should return a 200 status code if you are an admin.', async () => {
    const response = await request(app).get('/api/v1/users/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('users');
  });

  it('Should return a 403 status code if email registered is not an admin.', async () => {
    const response = await request(app).get('/api/v1/users/all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });
});