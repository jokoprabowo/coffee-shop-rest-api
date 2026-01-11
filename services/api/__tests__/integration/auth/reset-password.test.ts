import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';

describe('Reset password endpoint', () => {
  let userId: number;
  let resetToken: string;
  beforeAll(async () => {
    const res = await request(app).post('/api/v1/auth/login')
      .send({
        email: 'testexample@mail.com',
        password: 'Example!test123',
      });

    userId = res.body.data.user.id;

    const response = await request(app).post('/api/v1/auth/forgot-password')
      .send({
        email: 'testexample@mail.com',
      });

    resetToken = response.body.data.resetToken;
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return 200 status code and reset the password', async () => {
    const response = await request(app).put(`/api/v1/auth/reset-password?token=${resetToken}`)
      .send({
        newPassword: 'Example!test123',
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('Password successfully reset!');
  });

  it('Should return 400 status code for invalid token', async () => {
    const response = await request(app).put('/api/v1/auth/reset-password?token=invalidToken')
      .send({
        newPassword: 'Example!test123',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
    expect(response.body.message).toBe('Invalid or expired token');
  });
});