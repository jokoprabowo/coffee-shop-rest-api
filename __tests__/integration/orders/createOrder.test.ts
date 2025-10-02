import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Create order endpoint.', () => {
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
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
    await pool.end();
  });

  it('Should return a 201 status code if order successfully created.', async () => {
    await request(app).post('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({ coffeeId: 1, quantity: 1, });

    const response = await request(app).post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('CREATED');
    expect(response.body.data).toHaveProperty('order');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).post('/api/v1/orders');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });

  it('Should return a 404 status code if the cart with provided id is not exist.', async () => {
    const response = await request(app).post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');

  });
});