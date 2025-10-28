import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Create coffee endpoint', () => {
  let userId: number;
  let token: string;
  let coffeeId: string;

  const mockCoffee = {
    name: 'Luwak coffee', price: 10000, description: 'A classic coffee drink made by diluting a shot (or two) '+
    'of espresso with hot water.', image: 'https://example.com/americano.png'
  };

  afterEach(async () => {
    if (coffeeId) {
      await pool.query('delete from coffees where id = $1', [coffeeId]);
    }
    if (userId) {
      await pool.query('delete from users where id = $1', [userId]);
    }
  });

  it('Should return a 200 status code if user role is an admin.', async () => {
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

    const response = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${token}`)
      .send(mockCoffee); 
    
    coffeeId = response.body.data.coffee.id;

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('coffee');
    expect(response.body.data.coffee.name).toBe(mockCoffee.name);
  });

  it('Should return a 400 status code if provided coffee data invalid.', async () => {
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

    const response = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Luwak coffee' }); 

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).post('/api/v1/coffees')
      .send(mockCoffee); 

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHENTICATED');
  });

  it('Should return a 403 status code if email registered is not an admin.', async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({
        email: 'testexample@gmail.com', //this email is not on env whitelist
        password: 'Example!test123',
        fullname: 'Test Example',
        phone: '081234567890',
        address: 'Test street, Example, 00000'
      });

    userId = res.body.data.user.id;
    token = res.body.data.accessToken;

    const response = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${token}`)
      .send(mockCoffee);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });

  it('Should return a 409 status code if provided coffee name already exist.', async () => {
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

    const coffee = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${token}`)
      .send(mockCoffee); 

    const response = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${token}`)
      .send(mockCoffee); 

    coffeeId = coffee.body.data.coffee.id;

    expect(response.statusCode).toBe(409);
    expect(response.body.status).toBe('CONFLICT_ERROR');
  });
});