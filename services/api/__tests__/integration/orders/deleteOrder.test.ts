import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utils/token';

describe('Delete order endpoint.', () => {
  let userId: number;
  let adminId: number;
  let userToken: string;
  let adminToken: string;
  let cartId: number;
  let orderId: number;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    userToken = generateAccessToken(userId);
    adminId = await pool.query('select id from users where email = $1', ['adminexample@mail.com'])
      .then(res => res.rows[0].id);
    adminToken = generateAccessToken(adminId);

    cartId = await pool.query('insert into carts (user_id) values ($1) returning id', [userId]).then(res => res.rows[0].id);
    await pool.query('insert into cart_items (cart_id, coffee_id, quantity) values ($1, $2, $3) returning id', [cartId, 1, 1]);
    orderId = await pool.query('insert into orders (user_id, total) values ($1, $2) returning id', [userId, 1])
      .then(res => res.rows[0].id);
    await pool.query('insert into order_items (order_id, coffee_id, quantity, unit_price, total_price) values ($1, $2, $3, $4, $5)', [orderId, 1, 1, 10000, 10000]);
  });

  afterAll(async () => {
    await pool.query('delete from carts where id = $1', [cartId]);
    await pool.query('delete from orders where id = $1', [orderId]);
  });

  it('Should return a 403 status code if the order does not belong to the user.', async () => {
    const response = await request(app).delete(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });

  it('Should return a 200 status code if order successfully deleted.', async () => {
    const response = await request(app).delete(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).delete(`/api/v1/orders/${orderId}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 404 status code if the cart with provided id is not exist.', async () => {
    const response = await request(app).delete(`/api/v1/orders/${orderId + 1}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});