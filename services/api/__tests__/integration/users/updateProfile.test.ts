import request from 'supertest';
import app from '../../../src/app';
import { pool } from '@project/shared';
import { generateAccessToken } from '../../../src/utilities/token';

describe('Update profile endpoint.', () => {
  let userId: number;
  let token: string;

  beforeAll(async () => {
    userId = await pool.query('select id from users where email = $1', ['testexample@mail.com'])
      .then(res => res.rows[0].id);
    token = generateAccessToken(userId);
  });

  it('Should return a 200 status code if access code and all provided update data are correct.', async () => {
    const response = await request(app).put('/api/v1/users/update')
      .send({
        phone: '089876543210',
        address: 'Example street, Test, 00000'
      }).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user.phone).toBe('089876543210');
  });

  it('Should return a 400 status code if provided update data are invalid.', async () => {
    const response = await request(app).put('/api/v1/users/update')
      .send({
        phone: '000000000000',
        address: 'Test'
      }).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('BAD_REQUEST');
  });

  it('Should return a 401 status code if provided update data are invalid.', async () => {
    const response = await request(app).put('/api/v1/users/update')
      .send({
        phone: '089876543210',
        address: 'Example street, Test, 00000'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('UNAUTHORIZED');
  });

  it('Should return a 404 status code if provided update data are invalid.', async () => {
    const fakeToken = generateAccessToken(-1);
    const response = await request(app).put('/api/v1/users/update')
      .send({
        phone: '089876543210',
        address: 'Example street, Test, 00000'
      }).set('Authorization', `Bearer ${fakeToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('NOT_FOUND');
  });
});