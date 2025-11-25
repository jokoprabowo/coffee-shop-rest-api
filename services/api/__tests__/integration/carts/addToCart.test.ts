import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';

describe('Add to cart endpoint.', () => {
  let userId: number;
  let token: string;

  const mockCartItem = {
    coffeeId: 1, quantity: 1,
  };

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
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
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
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });
});