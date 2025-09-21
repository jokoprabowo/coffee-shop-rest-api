import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Get all orders endpoint.', () => {
  let userId: number;
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000'
      });

    token = res.body.data.accessToken;
    userId = res.body.data.user.id;

    await request(app).post('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ coffeeId: 1, quantity: 1, });

    await request(app).post('/api/v1/order')
      .set('Authorization', `Bearer ${token}`);
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
    await pool.end();
  });

  it('Should return a 200 status code if all order histories successfully retrieved.', async () => {
    const response = await request(app).get('/api/v1/order')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('orders');
    expect(Array.isArray(response.body.data.orders)).toBe(true);
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).get('/api/v1/order');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });
});