import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utils/token';

describe('Create coffee endpoint', () => {
  let userId: number;
  let adminId: number;
  let userToken: string;
  let adminToken: string;
  let coffeeId: string;

  const mockCoffee = {
    name: 'Test Coffee', price: 10000, description: 'A classic coffee drink made by diluting a shot (or two) '+
    'of espresso with hot water.', image: 'https://example.com/americano.png'
  };

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    userToken = generateAccessToken(userId);
    adminId = await pool.query('select id from users where email = $1', ['adminexample@mail.com'])
      .then(res => res.rows[0].id);
    adminToken = generateAccessToken(adminId);  
  });

  afterAll(async () => {
    await pool.query('delete from coffees where id = $1', [coffeeId]);
  });

  it('Should return a 200 status code if user role is an admin.', async () => {
    const response = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(mockCoffee); 
    
    coffeeId = response.body.data.coffee.id;

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('coffee');
    expect(response.body.data.coffee.name).toBe(mockCoffee.name);
  });

  it('Should return a 400 status code if provided coffee data invalid.', async () => {
    const response = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Luwak coffee' }); 

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).post('/api/v1/coffees')
      .send(mockCoffee); 

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 403 status code if email registered is not an admin.', async () => {
    const response = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${userToken}`)
      .send(mockCoffee);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });

  it('Should return a 409 status code if provided coffee name already exist.', async () => {
    // const coffee = await request(app).post('/api/v1/coffees')
    //   .set('Authorization', `Bearer ${adminToken}`)
    //   .send(mockCoffee); 

    const response = await request(app).post('/api/v1/coffees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(mockCoffee); 

    // coffeeId = response.body.data.coffee.id;

    expect(response.statusCode).toBe(409);
    expect(response.body.status).toBe('CONFLICT_ERROR');
  });
});