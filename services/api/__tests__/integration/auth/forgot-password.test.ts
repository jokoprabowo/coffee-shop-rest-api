import request from 'supertest';
import app from '../../../src/app';

describe('Forgot password endpoint', () => {
  it('Should return 200 status code and send reset password email', async () => {
    const response = await request(app).post('/api/v1/auth/forgot-password')
      .send({
        email: 'testexample@mail.com',
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
    expect(response.body.status).toBe('NOT_FOUND');
    expect(response.body.message).toBe('User not found!');
  });
});