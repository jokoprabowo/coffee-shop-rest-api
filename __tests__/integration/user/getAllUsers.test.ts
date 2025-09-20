import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Get all users endpoint.', () => {
  let userId: number;
  let token: string;

  afterEach(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it('Should return a 200 status code if you are an admin.', async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'jokoprabowo4550@gmail.com', //admin email on env whitelist
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000',
        role: 'admin'
      });

    userId = res.body.data.user.id;
    token = res.body.data.accessToken;

    const response = await request(app).get('/api/v1/user/all')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('users');
  });

  it('Should return a 403 status code if email registered is not an admin.', async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com', //this email is not on env whitelist
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000',
      });

    userId = res.body.data.user.id;
    token = res.body.data.accessToken;
    
    const response = await request(app).get('/api/v1/user/all')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });
});