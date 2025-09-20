import request from 'supertest';
import app from '../../../src/app';
import pool from '../../../src/config/db';

describe('Get coffee details endpoint', () => {
  let coffeeId: number;

  beforeAll(async () => {
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
    await pool.end();
  });

  it('Should return a 200 status code and coffee details', async () => {
    const response = await request(app).get(`/api/v1/coffee/${coffeeId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('coffee');
    expect(response.body.data.coffee.name).toBe('Americano');
  });

  it('Should return a 404 status code if provided coffee id is not exist.', async () => {
    const response = await request(app).get('/api/v1/coffee/-1');

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});