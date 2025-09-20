import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Update coffee endpoint', () => {
  let userId: number;
  let coffeeId: number;
  let token: string;

  beforeAll(async () => {
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

    const { rows } = await pool.query('insert into coffees(name, price, description, image) '+
      'values ($1, $2, $3, $4) returning id', [
      'Americano',
      10000,
      'A classic coffee drink made by diluting a shot (or two) of espresso with hot water.',
      'https://example.com/americano.png',
    ]);
    
    coffeeId = rows[0].id;
  });

  afterAll(async () => {
    await pool.query('delete from coffees where id = $1', [coffeeId]);
    await pool.query('delete from users where id = $1', [userId]);
    await pool.end();
  });

  it('Should return a 200 status code and coffee successfully updated.', async () => {
    const response = await request(app).put(`/api/v1/coffee/${coffeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 11000 });

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('coffee');
    expect(response.body.data.coffee.price).toBe(11000);
  });

  it('Should return a 400 status code if provided coffee data is invalid.', async () => {
    const response = await request(app).put(`/api/v1/coffee/${coffeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 'ABCDEFG' });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).put(`/api/v1/coffee/${coffeeId}`)
      .send({ price: 'ABCDEFG' });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });

  it('Should return a 404 status code if provided coffee id is not exist.', async () => {
    const response = await request(app).put('/api/v1/coffee/-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 11000 });

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });

  it('Should return a 403 status code if user with email registered is not an admin.', async () => {
    await pool.query('delete from users where id = $1', [userId]);
    
    const user = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com',
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000',
      });
    
    userId = user.body.data.user.id;
    token = user.body.data.accessToken;

    const response = await request(app).put(`/api/v1/coffee/${coffeeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 11000 });

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });
});