const {withServer, login } = require('../supertest.setup');
const {tables} = require('../../src/data');
const test = require('../../config/test');

const data = {
  regions: [
  {
    city: "Gent",
    total_buildings: 4,
    real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'
  },
  {
    city: "Kortrijk",
    total_buildings: 7,
    real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
  },
  {
    city: "Menen",
    total_buildings: 2,
    real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'
  }]
};

const dataToDelete = {
 regions: [
   'Menen',
   'Kortrijk',
   'Gent',
 ]
};

describe('regions', () => {
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

  const url = '/api/regions';

  describe('GET /api/regions', () => {
    beforeAll(async () => {
      await knex(tables.region).insert(data.regions);
    });

    afterAll(async () => {
      await knex(tables.region)
      .whereIn('city', dataToDelete.regions)
      .delete();
    });


    test('should 200 and return all regions', async () => {
      const response = await request.get(url)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(3);
    })

    test('should 200 and paginate the list of regions', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toEqual({
        city: "Gent",
        total_buildings: 4,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'
      });
      expect(response.body.data[1]).toEqual({
        city: "Kortrijk",
        total_buildings: 7,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
      });
      expect(response.body.data[2]).toEqual({
        city: "Menen",
        total_buildings: 2,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'
      });
    });
  });

  describe('GET /api/regions/:id', () => {
    beforeAll(async () => {
      await knex(tables.region).insert(data.regions);
    });

    afterAll(async () => {
      await knex(tables.region)
      .whereIn('city', dataToDelete.regions)
      .delete();
    });

    test('It should be 200 and return requested region', async () => {
      const regionId = data.regions[0].city;
      const response = await request.get(`${url}/${regionId}`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        city: "Gent",
        total_buildings: 4,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'
      })
    });
  });

  describe('POST /api/regions', () => {

    const regionsToDelete = [];

    afterAll(async () => {
      await knex(tables.region)
      .whereIn('city', regionsToDelete)
      .delete();
    });

    test('It should return 201 and return created region', async () => {
      const response = await request.post(url)
      .set('Authorization', loginHeader)
      .send({
        city: "Antwerpen",
        total_buildings: 327,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'
      });

      expect(response.status).toBe(201);
      expect(response.body.city).toBe('Antwerpen');
      expect(response.body.total_buildings).toBe(327);
      expect(response.body.real_estate_office_id).toBeTruthy();
    });
  });

  describe('PUT /api/regions/:id', () => {
    const regionsToDelete = [];

    beforeAll(async () => {
      await knex(tables.region).insert(data.regions[0]);
    });

    afterAll(async () => {
      await knex(tables.region)
      .whereIn('city', regionsToDelete)
      .delete();
    });

    test('It should return 200 and return the updated region', async () => {
      const regionId = data.regions[0].city;
      const response = await request.put(`${url}/${regionId}`)
      .set('Authorization', loginHeader)
      .send({
        total_buildings: 123,
      });

      expect(response.status).toBe(200);
      expect(response.body.city).toBe('Gent');
      expect(response.body.total_buildings).toBe(123);
      expect(response.body.real_estate_office_id).toBeTruthy();

      regionsToDelete.push(response.body.city);
    });
  });

  describe('DELETE /api/regions/:id', () => {
    beforeAll(async () => {
      await knex(tables.region).insert(data.regions[0]);
    });

    test('It should return 204 and return nothing', async () => {
      const regionId = data.regions[0].city;
      const response = await request.delete(`${url}/${regionId}`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});