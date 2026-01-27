import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utilities/token';

describe('Create order endpoint.', () => {
  let userId: number;
  let userToken: string;
  let cartId: number;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    userToken = generateAccessToken(userId);

    cartId = await pool.query('insert into carts (user_id) values ($1) returning id', [userId]).then(res => res.rows[0].id);
    await pool.query('insert into cart_items (cart_id, coffee_id, quantity) values ($1, $2, $3) returning id', [cartId, 1, 1]);
  });

  afterAll(async () => {
    await pool.query('delete from carts where id = $1', [cartId]);
  });

  it('Should return a 201 status code if order successfully created.', async () => {
    const response = await request(app).post('/api/v1/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('CREATED');
    expect(response.body.data).toHaveProperty('order');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).post('/api/v1/orders');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 404 status code if the cart with provided id is not exist.', async () => {
    const response = await request(app).post('/api/v1/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');

  });
});