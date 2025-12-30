import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';

describe('Reset password endpoint', () => {
  let userId: number;
  let resetToken: string;
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

    const response = await request(app).post('/api/v1/auth/forgot-password')
      .send({
        email: 'testexample@gmail.com',
      });

    resetToken = response.body.data.resetToken;
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return 200 status code and reset the password', async () => {
    const response = await request(app).post(`/api/v1/auth/reset-password?token=${resetToken}`)
      .send({
        newPassword: 'NewExample!test123',
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('Password successfully reset!');
  });

  it('Should return 400 status code for invalid token', async () => {
    const response = await request(app).post('/api/v1/auth/reset-password?token=invalidToken')
      .send({
        newPassword: 'NewExample!test123',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid or expired token');
  });
});