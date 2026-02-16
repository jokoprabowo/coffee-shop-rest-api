import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utils/token';

describe('Add to cart endpoint.', () => {
  let userId: number;
  let token: string;

  const mockCartItem = {
    coffeeId: 1, quantity: 1,
  };

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com']).then(res => res.rows[0].id);
    token = generateAccessToken(userId);
  });

  it('Should return a 201 status code and list of cart item.', async () => {
    const response = await request(app).post('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send(mockCartItem);

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('cartItems');
    expect(response.body.data.cartItems[0].quantity).toBe(1);
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).post('/api/v1/carts')
      .send(mockCartItem);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });
});