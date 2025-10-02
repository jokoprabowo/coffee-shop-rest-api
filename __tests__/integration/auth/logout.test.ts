import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Logout endpoint.', () => {
  let userId: number;
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
    cookie = res.headers['set-cookie'];
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
    await pool.end();
  });

  it('Should return a 200 status code and successfully logout.', async () => {
    const response = await request(app).delete('/api/v1/auth/logout')
      .set('Cookie', cookie);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});