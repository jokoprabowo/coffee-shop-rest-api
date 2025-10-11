import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Delete cart item endpoint.', () => {
  let userId: number;
  let token: string;
  let cartItemId: number;

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

    const cart = await request(app).post('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ coffeeId: 1, quantity: 1, });

    cartItemId = cart.body.data.cartItems[0].cart_item_id;
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return a 200 status code.', async () => {
    const response = await request(app).delete('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ cartItemId: cartItemId });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).delete('/api/v1/carts')
      .send({ cartItemId: cartItemId });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });

  it('Should return a 404 status code if cart item with provided id is not exist.', async () => {
    const response = await request(app).delete('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ cartItemId: -1 });

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});