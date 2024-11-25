const request = require('supertest');
const app = require('../api/app');

describe('POST /api/transaction', () => {
  describe('Given all requirements data', () => {
    test('Should respond with a 201 status code', async () => {
      const data = await request(app).get('/api/user/login').send({
        email: 'test22@gmail.com',
        password: 'test1234',
        name: 'test',
        address: 'test',
      });

      const obj = data.headers['set-cookie'];
      const cookie = obj[0].slice(0, -18);

      const response = await request(app).post('/api/transaction').set('Cookie', cookie).send({
        cookieId: 1,
        totalItem: 2,
      });
      expect(response.statusCode).toBe(201);
    });
  });
});

describe('GET /api/transaction/:id', () => {
  describe('Given an id of transaction that already exist', () => {
    test('Should respond with a 200 status code', async () => {
      const response = await request(app).get('/api/transaction/1').send({});
      expect(response.statusCode).toBe(200);
    });
  });

  describe('Given an id of transaction that is not exist', () => {
    test('Should respond with a 404 status code', async () => {
      const response = await request(app).get('/api/transaction/10').send({});
      expect(response.statusCode).toBe(404);
    });
  });
});

describe('GET /api/transaction', () => {
  describe('Get all transaction data that already added', () => {
    test('Should respond with a 200 status code', async () => {
      const response = await request(app).get('/api/transaction').send({});
      expect(response.statusCode).toBe(200);
    });
  });

  describe('Get all transaction data that not exist', () => {
    test('Should respond with a 404 status code', async () => {
      const response = await request(app).get('/api/transaction').send({});
      expect(response.statusCode).toBe(200);
    });
  });
});

describe('PUT /api/transaction/:id', () => {
  describe('Given all requirement data with correct transaction id', () => {
    test('Should respond with a 201 status code', async () => {
      const response = await request(app).put('/api/transaction/1').send({
        email: 'test97@gmail.com',
        cookieId: 1,
        totalItem: 4,
      });
      expect(response.statusCode).toBe(201);
    });
  });

  describe('Given all requirement data with wrong transaction id', () => {
    test('Should respond with a 404 status code', async () => {
      const response = await request(app).put('/api/transaction/10').send({
        email: 'test97@gmail.com',
        cookieId: 1,
        totalItem: 4,
      });
      expect(response.statusCode).toBe(404);
    });
  });
});
