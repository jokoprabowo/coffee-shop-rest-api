import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Refresh token endpoint.', () => {
  let userId: number;
  let token: string;
  let cookie: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000'
      });

    userId = res.body.data.user.id;
    token = res.body.data.accessToken;
    cookie = res.headers['set-cookie'];
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
    await pool.end();
  });

  it('Should return a 200 status code and get new access token.', async () => {
    const response = await request(app).post('/api/v1/auth/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookie);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('Should return a 400 status code if refresh token is wrong.', async () => {
    const fakeCookie = [
      'refreshToken=e631edba4b7ebc6afad6bb9e330dfc4bd1d9ef6ba0b0f39c7c271be01d987uy; Path=/; HttpOnly; SameSite=Strict'
    ];
    const response = await request(app).post('/api/v1/auth/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', fakeCookie);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).post('/api/v1/auth/refresh-token')
      .set('Cookie', cookie);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });

  it('Should return a 403 status code if refresh token is revoked.', async () => {
    await request(app).delete('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookie);

    const response = await request(app).post('/api/v1/auth/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookie);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });
});