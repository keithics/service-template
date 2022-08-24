import request from 'supertest';
import { mongo } from 'server/mongo';
import app from 'server/app';
import createFakeUser from '@signalyticsai/core/lib/jest.fake-user';
import jsonUpdate from './json/pokemon-update.json';
import json from './json/pokemon.json';

let token = '';
let createdId = '';
jest.mock('libraries/helpers');
jest.mock('server/config');

beforeAll(async () => {
  await mongo.dropAllCollections();
  // create user
  const fakeUser = await createFakeUser(false);
  token = fakeUser.token;
});

afterAll((done) => {
  (async () => {
    await mongo.dropAllCollections();
    await mongo.close();
  })();
  done();
});

describe('Pokemon Tests', () => {
  describe('CRUD routes', () => {
    test('CREATE - Should respond with status code 200', async () => {
      const response = await request(app)
        .post('/')
        .send(json)
        //
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
      createdId = response.body._id;
    });

    test('CREATE WITHOUT TOKEN - Should respond with status code 401', async () => {
      const response = await request(app).post('/').send(json);
      expect(response.status).toEqual(401);
    });

    test('READ ONE  - Should respond with status code 200', async () => {
      const response = await request(app)
        .get(`/${createdId}`)
        //
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
    });

    test('READ ONE WITHOUT TOKEN - Should respond with status code 401', async () => {
      const response = await request(app).get(`/${createdId}`);
      expect(response.status).toEqual(401);
    });

    test('PAGINATION - Should respond with status code 401', async () => {
      const response = await request(app)
        .post('/page')
        .send({ page: 1 })
        //
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
    });

    test('PAGINATION WITHOUT TOKEN - Should respond with status code 401', async () => {
      const response = await request(app).get('/page/1');
      expect(response.status).toEqual(401);
    });

    test('FILTERING  - Should respond with status code 200', async () => {
      const response = await request(app)
        .post(`/filter`)
        .send({
          filters: [
            {
              key: 'type',
              value: 'electric',
            },
          ],
        })
        //
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
    });

    test('SEARCHING  - Should respond with status code 200', async () => {
      const response = await request(app)
        .post(`/search`)
        .send({
          key: 'name',
          value: 'pika',
        })
        //
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
    });

    test('UPDATE ONE  - Should respond with status code 200', async () => {
      const response = await request(app)
        .put(`/${createdId}`)
        .send(jsonUpdate)
        //
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toMatchSnapshot();
    });

    test('UPDATE ONE WITHOUT TOKEN  - Should respond with status code 401', async () => {
      const response = await request(app).put(`/${createdId}`).send(jsonUpdate);
      expect(response.status).toEqual(401);
    });

    test('DELETE ONE  - Should respond with status code 200', async () => {
      const response = await request(app)
        .delete(`/${createdId}`)
        //
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });

    test('DELETE ONE WITHOUT TOKEN - Should respond with status code 401', async () => {
      const response = await request(app).delete(`/${createdId}`);
      expect(response.status).toEqual(401);
    });
  });

  // end of v1
});
