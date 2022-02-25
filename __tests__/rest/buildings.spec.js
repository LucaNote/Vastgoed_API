const {withServer, login } = require('../supertest.setup');
const {tables} = require('../../src/data');
const test = require('../../config/test');

const data = { 
  buildings: [{
    building_id: '7f28c5f9-d712-4cd6-ac15-d13d71abff84',
    location_id: '7f28c5f9-d711-4cd5-ac15-d13d71abff84',
    street: 'Elfde-julistraat',
    building_number: 159,
    price: 190000 ,
    real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
  },
  {
    building_id:'7f28c5f9-d710-4cd6-ac15-d13d71abff84',
    location_id: '7f28c5f9-d711-4cd4-ac15-d13d71abff84',
    street: 'Fonteinstraat',
    building_number: 24 ,
    price: 340000 ,
    real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'
  },
  {
    building_id:'7f28c5f9-d709-4cd6-ac15-d13d71abff84',
    location_id: '7f28c5f9-d711-4cd3-ac15-d13d71abff84',
    street: 'Straat-Te-Gent',
    building_number: 148 ,
    price: 253000 ,
    real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'
  }]
};

const dataToDelete = {
  buildings: [
    '7f28c5f9-d712-4cd6-ac15-d13d71abff84',
    '7f28c5f9-d710-4cd6-ac15-d13d71abff84',
    '7f28c5f9-d709-4cd6-ac15-d13d71abff84',
  ]
}

describe('buildings', () => {
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

  const url = '/api/buildings';

  describe('GET /api/buildings', () => {
    beforeAll(async () => {
      await knex(tables.building).insert(data.buildings);
    });

    afterAll(async () => {
      await knex(tables.building)
      .whereIn('building_id', dataToDelete.buildings)
      .delete();
    });


    test('should 200 and return all buildings', async () => {
      const response = await request.get(url)
      .set('Authorization', loginHeader);
      
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(3);
    })

    test('should 200 and paginate the list of buildings', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toEqual({
        building_id: '7f28c5f9-d712-4cd6-ac15-d13d71abff84',
        location_id: '7f28c5f9-d711-4cd5-ac15-d13d71abff84',
        street: 'Elfde-julistraat',
        building_number: 159,
        price: 190000 ,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
      });
      expect(response.body.data[1]).toEqual({
        building_id:'7f28c5f9-d710-4cd6-ac15-d13d71abff84',
        location_id: '7f28c5f9-d711-4cd4-ac15-d13d71abff84',
        street: 'Fonteinstraat',
        building_number: 24 ,
        price: 340000 ,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'
      });
      expect(response.body.data[2]).toEqual({
        building_id:'7f28c5f9-d709-4cd6-ac15-d13d71abff84',
        location_id: '7f28c5f9-d711-4cd3-ac15-d13d71abff84',
        street: 'Straat-Te-Gent',
        building_number: 148 ,
        price: 253000 ,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'
      });
    });
  });

  describe('GET /api/buildings/:id', () => {
    beforeAll(async () => {
      await knex(tables.building).insert(data.buildings);
    });

    afterAll(async () => {
      await knex(tables.building)
      .whereIn('building_id', dataToDelete.buildings)
      .delete();
    });

    test('It should be 200 and return requested building', async () => {
      const buildingId = data.buildings[0].building_id;
      const response = await request.get(`${url}/${buildingId}`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        building_id: '7f28c5f9-d712-4cd6-ac15-d13d71abff84',
        location_id: '7f28c5f9-d711-4cd5-ac15-d13d71abff84',
        street: 'Elfde-julistraat',
        building_number: 159,
        price: 190000 ,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
      });
    });
  });

  describe('POST /api/buildings', () => {

    const buildingsToDelete = [];

    afterAll(async () => {
      await knex(tables.building)
      .whereIn('building_id', buildingsToDelete)
      .delete();
    });

    test('It should return 201 and return created building', async () => {
      const response = await request.post(url)
      .set('Authorization', loginHeader)
      .send({
        building_id: '7f28c5f9-d722-4cd6-ac15-d13d71abff84',
        location_id: '7f28c5f9-d711-4cd4-ac15-d13d71abff84',
        street: 'Elfde julilaan',
        building_number: 29,
        price: 253000,
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'
      });

      expect(response.status).toBe(201);
      expect(response.body.building_id).toBeTruthy();
      expect(response.body.location_id).toBeTruthy();
      expect(response.body.street).toBe('Elfde julilaan');
      expect(response.body.building_number).toBe(29);
      expect(response.body.price).toBe(253000);
      expect(response.body.real_estate_office_id).toBeTruthy();

      buildingsToDelete.push(response.body.building_id);
    });
  });

  describe('PUT /api/buildings/:id', () => {
    const buildingsToDelete = [];

    beforeAll(async () => {
      await knex(tables.building).insert(data.buildings[0]);
    });

    afterAll(async () => {
      await knex(tables.building)
      .whereIn('building_id', buildingsToDelete)
      .delete();
    });

    test('It should return 200 and return the updated building', async () => {
      const buildingId = data.buildings[0].building_id;
      const response = await request.put(`${url}/${buildingId}`)
      .set('Authorization', loginHeader)
      .send({
        price: 530500,
        building_number: 28
      });
      expect(response.status).toBe(200);
      expect(response.body.building_id).toBeTruthy();
      expect(response.body.location_id).toBeTruthy();
      expect(response.body.street).toBe('Elfde julilaan');
      expect(response.body.building_number).toBe(28);
      expect(response.body.price).toBe(530500);
      expect(response.body.real_estate_office_id).toBeTruthy();

      buildingsToDelete.push(response.body.building_id);
    });
  });

  describe('DELETE /api/buildings/:id', () => {
    beforeAll(async () => {
      await knex(tables.building).insert(data.buildings[0]);
    });

    test('It should return 204 and return nothing', async () => {
      const buildingId = data.buildings[0].building_id;
      const response = await request.delete(`${url}/${buildingId}`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});