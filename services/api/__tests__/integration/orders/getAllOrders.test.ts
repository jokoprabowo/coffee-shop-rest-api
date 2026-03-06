import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utils/token';

describe('Get all orders endpoint.', () => {
  let userId: number;
  let userToken: string;
  let cartId: number;
  let orderId: number;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    userToken = generateAccessToken(userId);

    cartId = await pool.query('insert into carts (user_id) values ($1) returning id', [userId]).then(res => res.rows[0].id);
    await pool.query('insert into cart_items (cart_id, coffee_id, quantity) values ($1, $2, $3) returning id', [cartId, 1, 1]);
    orderId = await pool.query('insert into orders (user_id, total) values ($1, $2) returning id', [userId, 1])
      .then(res => res.rows[0].id);
  });

  afterAll(async () => {
    await pool.query('delete from carts where id = $1', [cartId]);
    await pool.query('delete from orders where id = $1', [orderId]);
  });

  it('Should return a 200 status code if all order histories successfully retrieved.', async () => {
    const response = await request(app).get('/api/v1/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('orders');
    expect(Array.isArray(response.body.data.orders)).toBe(true);
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).get('/api/v1/orders');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });
});