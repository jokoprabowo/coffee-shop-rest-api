import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';
import { generateAccessToken } from '../../../src/utilities/token';

describe('Delete user account endpoint.', () => {
  let userId: number;
  let token: string;
  let cookie: string;

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
    cookie = res.headers['set-cookie'];
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
    await pool.end();
  });

  it('Should return a 200 status code if user successfully deleted', async () => {
    const response = await request(app).delete('/api/v1/users/delete')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User has been deleted!');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).delete('/api/v1/users/delete')
      .set('Cookie', cookie);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const fakeToken = generateAccessToken(-1);
    const response = await request(app).delete('/api/v1/users/delete')
      .set('Authorization', `Bearer ${fakeToken}`)
      .set('Cookie', cookie);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});