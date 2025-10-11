import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Get order details endpoint.', () => {
  let userId: number;
  let token: string;
  let orderId: number;

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

    await request(app).post('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ coffeeId: 1, quantity: 1, });

    const order = await request(app).post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`);
    
    orderId = order.body.data.order.id;
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return a 200 status code if the order details successfully retrieved.', async () => {
    const response = await request(app).get(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.data).toHaveProperty('orders');
    expect(Array.isArray(response.body.data.orders)).toBe(true);
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).get(`/api/v1/orders/${orderId}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });

  it('Should return a 404 status code if the cart with provided id is not exist.', async () => {
    const response = await request(app).get('/api/v1/orders/0')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});