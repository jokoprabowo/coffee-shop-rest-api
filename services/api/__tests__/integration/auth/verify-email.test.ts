import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';

describe('Email verification endpoint', () => {
  let userId: number;
  let verifyToken: string;
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
    verifyToken = res.body.data.verificationToken;
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  it('Should return a 200 status code and verify the user email successfully', async () => {
    const response = await request(app).get(`/api/v1/auth/verify?token=${verifyToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('Email successfully verified!');
  });

  it('Should return a 400 status code if the verification token is invalid', async () => {
    const response = await request(app).get('/api/v1/auth/verify?token=invalidToken');

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });
});