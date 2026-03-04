import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utils/token';

describe('Update cart item endpoint.', () => {
  let userId: number;
  let token: string;
  let cartId: number;
  let cartItemId: number;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    token = generateAccessToken(userId);    
    cartId = await pool.query('insert into carts (user_id) values ($1) returning id', [userId]).then(res => res.rows[0].id);
    cartItemId = await pool.query('insert into cart_items (cart_id, coffee_id, quantity) values ($1, $2, $3) returning id', [cartId, 1, 1])
      .then(res => res.rows[0].id);
  });

  afterAll(async () => {
    await pool.query('delete from carts where id = $1', [cartId]);
  });

  it('Should return a 200 status code.', async () => {
    const response = await request(app).put('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ cartItemId: cartItemId, quantity: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('Should return a 400 status code if request body is invalid.', async () => {
    const response = await request(app).put('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ cartItemId: 'a', quantity: 'b' });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).put('/api/v1/carts')
      .send({ cartItemId: cartItemId, quantity: 1 });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 404 status code if cart item with provided id is not exist.', async () => {
    const nonExistingCartItemId = cartItemId + 1;
    const response = await request(app).put('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ cartItemId: nonExistingCartItemId, quantity: 1 });

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});