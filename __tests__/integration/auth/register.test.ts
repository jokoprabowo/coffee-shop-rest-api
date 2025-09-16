import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Registration endpoint', () => {
  let userId: number;

  afterEach( async () => {
    if (userId) {
      await pool.query('delete from users where id = $1', [userId]);
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it('Should return a 201 status code and user registered successfully', async () => {
    const response = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000'
      });

    if(response.body.data){
      userId = response.body.data.user.id;
    }

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user.email).toBe('testexample@gmail.com');
  });

  it('Should return a 400 status code for invalid input', async () => {
    const response = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testmail',
        password: 'test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000'
      });

    if(response.body.data){
      userId = response.body.data.user.id;
    }

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 403 status code if you trying to register as an admin using email that '+
    'is not in the whitelists', async () => {
    const response = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000',
        role: 'admin'
      });

    if(response.body.data){
      userId = response.body.data.user.id;
    }

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });

  it('Should return a 409 status code if you register using registered email', async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000'
      });
    
    const response = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000'
      });

    if(res.body.data){
      userId = res.body.data.user.id;
    }

    expect(response.statusCode).toBe(409);
    expect(response.body.status).toBe('CONFLICT_ERROR');
  });
});