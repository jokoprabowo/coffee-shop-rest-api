import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utils/token';

describe('Get most favorite coffees endpoint', () => {
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

  it('Should return a 200 status code and list of favorite coffees', async () => {
    const response = await request(app).get('/api/v1/coffees/most-favorite')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('coffees');
    expect(Array.isArray(response.body.data.coffees)).toBe(true);
  });
  
  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).get('/api/v1/coffees/most-favorite');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 403 status code if email registered is not an admin.', async () => {
    const response = await request(app).get('/api/v1/coffees/most-favorite')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });
});