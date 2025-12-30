import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';

describe('Forgot password endpoint', () => {
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

    await pool.query('update users set is_verified = true where id = $1', [userId]);

    userId = res.body.data.user.id;
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return 200 status code and send reset password email', async () => {
    const response = await request(app).post('/api/v1/auth/forgot-password')
      .send({
        email: 'testexample@gmail.com',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('Password reset link sent to your email.');
  });

  it('Should return 404 status code for non-existing email', async () => {
    const response = await request(app).post('/api/v1/auth/forgot-password')
      .send({
        email: 'testexamplemail@gmail.com',
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT FOUND');
    expect(response.body.message).toBe('User not found!');
  });
});