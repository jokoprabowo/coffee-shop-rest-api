import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utils/token';

describe('Delete coffee endpoint', () => {
  let userId: number;
  let adminId: number;
  let userToken: string;
  let adminToken: string;
  let coffeeId: string;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    userToken = generateAccessToken(userId);

    adminId = await pool.query('select id from users where email = $1', ['adminexample@mail.com'])
      .then(res => res.rows[0].id);
    adminToken = generateAccessToken(adminId);

    coffeeId = await pool.query('insert into coffees(name, price, description, image) '+
      'values ($1, $2, $3, $4) returning id', [
      'Test Coffee',
      10000,
      'A classic coffee drink made by diluting a shot (or two) of espresso with hot water.',
      'https://example.com/americano.png',
    ]).then(res => res.rows[0].id);
  });

  // beforeEach(async () => {
  //   const { rows } = await pool.query('insert into coffees(name, price, description, image) '+
  //     'values ($1, $2, $3, $4) returning id', [
  //     'Americano',
  //     10000,
  //     'A classic coffee drink made by diluting a shot (or two) of espresso with hot water.',
  //     'https://example.com/americano.png',
  //   ]);
    
  //   coffeeId = rows[0].id;
  // });

  // afterEach(async () => {
  //   if (coffeeId){
  //     await pool.query('delete from coffees where id = $1', [coffeeId]);
  //   }
  // });

  it('Should return a 200 status code and coffee successfully deleted.', async () => {
    const response = await request(app).delete(`/api/v1/coffees/${coffeeId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).delete(`/api/v1/coffees/${coffeeId}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 404 status code if provided coffee id is not exist.', async () => {
    const response = await request(app).delete('/api/v1/coffees/-1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });

  it('Should return a 403 status code if user with email registered is not an admin.', async () => {

    const response = await request(app).delete(`/api/v1/coffees/${coffeeId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe('FORBIDDEN');
  });
});