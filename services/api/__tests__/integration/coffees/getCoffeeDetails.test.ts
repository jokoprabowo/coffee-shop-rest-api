import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utilities/token';

describe('Get coffee details endpoint', () => {
  let userId: number;
  let token: string;
  let coffeeId: number;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com']).then(res => res.rows[0].id);
    token = generateAccessToken(userId);

    coffeeId = await pool.query('insert into coffees(name, price, description, image) '+
      'values ($1, $2, $3, $4) returning id', [
      'Test Coffee',
      10000,
      'A classic coffee drink made by diluting a shot (or two) of espresso with hot water.',
      'https://example.com/americano.png',
    ]).then(res => res.rows[0].id);
  });

  afterAll(async () => {
    await pool.query('delete from coffees where id = $1', [coffeeId]);
  });

  it('Should return a 200 status code and coffee details', async () => {
    const response = await request(app).get(`/api/v1/coffees/${coffeeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('coffee');
    expect(response.body.data.coffee.name).toBe('Test Coffee');
  });

  it('Should return a 401 status code if access token is missing.', async () => {
    const response = await request(app).get('/api/v1/coffees/1');

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 404 status code if provided coffee id is not exist.', async () => {
    const response = await request(app).get('/api/v1/coffees/-1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});