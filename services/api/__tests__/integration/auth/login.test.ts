import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { encryptInput } from '@project/shared';

describe('Login endpoint.', () => {
  let userId: number;
  beforeAll(async () => {
    userId = await pool.query('insert into users (email, password, fullname, phone, address, is_verified)' +
      ' values ($1, $2, $3, $4, $5, $6) returning id', [
      'testuserexample@mail.com',
      await encryptInput('Example!test123'),
      'Test Example',
      '081234567890',
      'Test street, Example, 00000',
      false,
    ]).then(res => res.rows[0].id);
  });

  afterAll(async () => {
    await pool.query('delete from users where id = $1', [userId]);
  });
  
  it('Should return a 200 status code, user and and accees token if user login successfully.', async () => {
    const response = await request(app).post('/api/v1/auth/login')
      .send({
        email: 'testexample@mail.com',
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
        email: 'testexample@mail.com',
        password: 'Example!test12345'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 403 status code if user email in not verified', async () => {
    const response = await request(app).post('/api/v1/auth/login')
      .send({
        email: 'testuserexample@mail.com',
        password: 'Example!test123'
      });
    
    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });

  it('Should return a 404 status code if a user account with the provided email is not found.', async () => {
    const response = await request(app).post('/api/v1/auth/login')
      .send({
        email: 'example@mail.com',
        password: 'Example!test123'
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});