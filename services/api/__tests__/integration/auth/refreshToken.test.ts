import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';

describe('Refresh token endpoint.', () => {
  let userId: number;
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
    cookie = res.headers['set-cookie'];
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return a 200 status code and get new access token.', async () => {
    const response = await request(app).post('/api/v1/auth/refresh-token')
      .set('Cookie', cookie);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('Should return a 403 status code if refresh token is revoked.', async () => {
    await request(app).delete('/api/v1/auth/logout')
      .set('Cookie', cookie);

    const response = await request(app).post('/api/v1/auth/refresh-token')
      .set('Cookie', cookie);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });

  it('Should return a 404 status code if selector in refresh token is wrong.', async () => {
    const data = cookie[0].split('=')[1].split(';')[0];
    const changeToken = data.substring(0,66)+'x'+data.substring(67);
    const fakeCookie = ['refreshToken='+changeToken+';'];

    const response = await request(app).post('/api/v1/auth/refresh-token')
      .set('Cookie', fakeCookie);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });
});