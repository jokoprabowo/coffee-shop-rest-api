const request = require('supertest');
const app = require('../src/app');

describe('PUT /api/user/update', () => {
  describe('Given all the update data', () => {
    test('Should respond with a 201 status code', async () => {
      const data = await request(app).get('/api/user/login').send({
        email: 'test22@gmail.com',
        password: 'test1234',
        name: 'test',
        address: 'test',
      });

      const obj = data.headers['set-cookie'];
      const cookie = obj[0].slice(0, -18);

      const response = await request(app).put('/api/user/update').set('Cookie', cookie).send({
        email: 'test22@gmail.com',
        password: 'test1234',
        name: 'test',
        address: 'test',
      });
      expect(response.statusCode).toBe(201);
    });
  });
});

describe('GET /api/user/profile', () => {
  describe('Access the endpoint', () => {
    test('Should respond with a 201 status code', async () => {
      const data = await request(app).get('/api/user/login').send({
        email: 'test22@gmail.com',
        password: 'test1234',
        name: 'test',
        address: 'test',
      });

      const obj = data.headers['set-cookie'];
      const cookie = obj[0].slice(0, -18);

      const response = await request(app).get('/api/user/profile').set('Cookie', cookie).send();
      expect(response.statusCode).toBe(201);
    });
  });
});
