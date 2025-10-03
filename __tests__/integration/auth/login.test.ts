import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Login endpoint.', () => {
  let userId: number;
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
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
    await pool.end();
  });
  
  it('Should return a 200 status code, user and and accees token if user login successfully.', async () => {
    const response = await request(app).post('/api/v1/auth/login')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('Should return a 400 status code if provided password is invalid.', async () => {
    const response = await request(app).post('/api/v1/auth/login')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test12345'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 404 status code if a user account with the provided email is not found.', async () => {
    const response = await request(app).post('/api/v1/auth/login')
      .send({
        email: 'example@gmail.com',
        password: 'Example!test123'
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});