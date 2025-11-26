import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';

describe('Get cart item endpoint.', () => {
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

    userId = res.body.data.user.id;
    token = res.body.data.accessToken;
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return a 200 status code and list of cart items', async () => {
    const response = await request(app).get('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('cartItems');
    expect(Array.isArray(response.body.data.cartItems)).toBe(true);
  });

  it('Should return a 401 status code if access token is missing', async () => {
    const response = await request(app).get('/api/v1/carts');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });
});