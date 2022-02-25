const {withServer, login } = require('../supertest.setup');
const {tables} = require('../../src/data');
const test = require('../../config/test');

const data = {
  offices: [
  {
    real_estate_office_id: "7f28c5f9-d711-4cd6-ac14-d13d71abff84",
    location_id: "7f27c5f9-d711-4cd6-ac14-d13d71abff84"
  },
  {
    real_estate_office_id: "7f28c5f9-d711-4cd6-ac13-d13d71abff84",
    location_id: "7f26c5f9-d711-4cd6-ac14-d13d71abff84"
  },
  {
    real_estate_office_id: "7f28c5f9-d711-4cd6-ac12-d13d71abff84",
    location_id: "7f25c5f9-d711-4cd6-ac14-d13d71abff84"
  }]
};

const dataToDelete = {
offices : [
  "7f28c5f9-d711-4cd6-ac14-d13d71abff84",
  "7f28c5f9-d711-4cd6-ac13-d13d71abff84",
  "7f28c5f9-d711-4cd6-ac12-d13d71abff84"
]
};

describe('offices', () => {
  let loginHeader;
  let request;
  let knex;

  withServer(({ knex: k, supertest: s}) => {
    knex = k;
    request = s;
  });

  beforeAll(async () => {
    loginHeader = await login(request);
  })

  const url = '/api/real_estate_offices';

  describe('GET /api/real_estate_offices', () => {
    beforeAll(async () => {
      await knex(tables.real_estate_office).insert(data.offices);
    });

    afterAll(async () => {
      await knex(tables.real_estate_office)
      .whereIn('real_estate_office_id', dataToDelete.offices)
      .delete();
    });


    test('should 200 and return all offices', async () => {
     const response = await request.get(url)
     .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(3);
    })

    test('should 200 and paginate the list of offices', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toEqual({
        real_estate_office_id: "7f28c5f9-d711-4cd6-ac14-d13d71abff84",
        location_id: "7f27c5f9-d711-4cd6-ac14-d13d71abff84"
      });
      expect(response.body.data[1]).toEqual({
        real_estate_office_id: "7f28c5f9-d711-4cd6-ac13-d13d71abff84",
        location_id: "7f26c5f9-d711-4cd6-ac14-d13d71abff84"
      });
      expect(response.body.data[2]).toEqual({
        real_estate_office_id: "7f28c5f9-d711-4cd6-ac12-d13d71abff84",
        location_id: "7f25c5f9-d711-4cd6-ac14-d13d71abff84"
      });
    });
  });

  describe('GET /api/real_estate_offices/:id', () => {
    beforeAll(async () => {
      await knex(tables.real_estate_office).insert(data.offices);
    });

    afterAll(async () => {
      await knex(tables.real_estate_office)
      .whereIn('real_estate_office_id', dataToDelete.offices)
      .delete();
    });

    test('It should be 200 and return requested office', async () => {
      const officeId = data.offices[0].real_estate_office_id;
      const response = await request.get(`${url}/${officeId}`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        real_estate_office_id: "7f28c5f9-d711-4cd6-ac14-d13d71abff84",
        location_id: "7f27c5f9-d711-4cd6-ac14-d13d71abff84"
      })
    });
  });

  describe('POST /api/real_estate_offices', () => {

    const officesToDelete = [];

    afterAll(async () => {
      await knex(tables.real_estate_office)
      .whereIn('real_estate_office_id', officesToDelete)
      .delete();
    });

    test('It should return 201 and return created office', async () => {
      const response = await request.post(url)
      .set('Authorization', loginHeader)
      .send({
        real_estate_office_id: "7f28c5f9-d711-4cd6-ac56-d13d71abff84",
        location_id: "7f77c5f9-d711-4cd6-ac14-d13d71abff84"
      });

      expect(response.status).toBe(201);
      expect(response.body.real_estate_office_id).toBeTruthy();
      expect(response.body.location_id).toBeTruthy();

      officesToDelete.push(response.body.real_estate_office_id);
    });
  });

  describe('PUT /api/real_estate_offices/:id', () => {
    const officesToDelete = [];

    beforeAll(async () => {
      await knex(tables.real_estate_office).insert(data.offices[0]);
    });

    afterAll(async () => {
      await knex(tables.real_estate_office)
      .whereIn('real_estate_office_id', officesToDelete)
      .delete();
    });

    test('It should return 200 and return the updated office', async () => {
      const officeId = data.offices[0].real_estate_office_id;
      const response = await request.put(`${url}/${officeId}`)
      .set('Authorization', loginHeader)
      .send({
        location_id: "7f77c5f9-d711-4cd6-ac14-d13d71abff84"
      });

      expect(response.status).toBe(200);
      expect(response.body.real_estate_office_id).toBeTruthy();
      expect(response.body.location_id).toEqual("7f77c5f9-d711-4cd6-ac14-d13d71abff84");

      officesToDelete.push(response.body.real_estate_office_id);
      
    });
  });

  describe('DELETE /api/real_estate_offices/:id', () => {
    beforeAll(async () => {
      await knex(tables.real_estate_office).insert(data.offices[0]);
    });

    test('It should return 204 and return nothing', async () => {
      const officeId = data.offices[0].real_estate_office_id;
      const response = await request.delete(`${url}/${officeId}`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});