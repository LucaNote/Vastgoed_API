const {withServer, login } = require('../supertest.setup');
const {tables} = require('../../src/data');
const test = require('../../config/test');

const data = {
  agents: [
    {
      real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff74',
      name: 'agent001',
      email: 'agent001@office02.com',
      real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
    },
    {
      real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff64',
      name: 'agent002',
      email: 'agent007@office01.com',
      real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'
    },
    {
      real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff54',
      name: 'agent003',
      email: 'agent023@office01.com',
      real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'
  }]
};

const dataToDelete = {
agents : [
  '7f28c5f9-d711-4cd6-ac15-d13d71abff74',
  '7f28c5f9-d711-4cd6-ac15-d13d71abff64',
  '7f28c5f9-d711-4cd6-ac15-d13d71abff54'
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

  const url = '/api/real_estate_agents';

  describe('GET /api/real_estate_agents', () => {
    beforeAll(async () => {
      await knex(tables.real_estate_agent).insert(data.agents);
    });

    afterAll(async () => {
      await knex(tables.real_estate_agent)
      .whereIn('real_estate_agent_id', dataToDelete.agents)
      .delete();
    });


    test('should 200 and return all agents', async () => {
     const response = await request.get(url)
     .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(3);
    })

    test('should 200 and paginate the list of agents', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toEqual({
        real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff74',
        name: 'agent001',
        email: 'agent001@office02.com',
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
      });
      expect(response.body.data[1]).toEqual({
        real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff64',
        name: 'agent002',
        email: 'agent007@office01.com',
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'
      });
      expect(response.body.data[2]).toEqual({
        real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff54',
        name: 'agent003',
        email: 'agent023@office01.com',
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'
      });
    });
  });

  describe('GET /api/real_estate_agents/:id', () => {
    beforeAll(async () => {
      await knex(tables.real_estate_agent).insert(data.agents);
    });

    afterAll(async () => {
      await knex(tables.real_estate_agent)
      .whereIn('real_estate_agent_id', dataToDelete.agents)
      .delete();
    });

    test('It should be 200 and return requested agent', async () => {
      const agentId = data.agents[0].real_estate_agent_id;
      const response = await request.get(`${url}/${agentId}`)
      .set('Authorization', loginHeader);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff74',
        name: 'agent001',
        email: 'agent001@office02.com',
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
      });
    });
  });

  describe('POST /api/real_estate_agents', () => {

    const agentsToDelete = [];

    afterAll(async () => {
      await knex(tables.real_estate_agent)
      .whereIn('real_estate_agent_id', agentsToDelete)
      .delete();
    });

    test('It should return 201 and return created agent', async () => {
      const response = await request.post(url)
      .set('Authorization', loginHeader)
      .send({
        real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff94',
        name: 'agent523',
        email: 'agent523@office02.com',
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'
      });

      expect(response.status).toBe(201);
      expect(response.body.real_estate_agent_id).toBeTruthy();
      expect(response.body.name).toBe('agent523');
      expect(response.body.email).toBe('agent523@office02.com');
      expect(response.body.real_estate_office_id).toBeTruthy();

      agentsToDelete.push(response.body.real_estate_agent_id);
    });
  });

  describe('PUT /api/real_estate_agents/:id', () => {
    const agentsToDelete = [];

    beforeAll(async () => {
      await knex(tables.real_estate_agent).insert(data.agents[0]);
    });

    afterAll(async () => {
      afterAll(async () => {
        await knex(tables.real_estate_agent)
        .whereIn('real_estate_agent_id', agentsToDelete)
        .delete();
      });
    });

    test('It should return 200 and return the updated agent', async () => {
      const agentId = data.agents[0].real_estate_agent_id;
      const response = await request.put(`${url}/${agentId}`)
      .set('Authorization', loginHeader)
      .send({
        name: "agent999",
        email: "agent999@office02.com"
      });

      expect(response.status).toBe(200);
      expect(response.body.real_estate_agent_id).toBeTruthy();
      expect(response.body.name).toBe('agent999');
      expect(response.body.email).toBe('agent999@office02.com');
      expect(response.body.real_estate_office_id).toBeTruthy();
      
      agentsToDelete.push(response.body.real_estate_agent_id);
    });
  });

  describe('DELETE /api/real_estate_agents/:id', () => {
    beforeAll(async () => {
      await knex(tables.real_estate_agent).insert(data.agents[0]);
    });

    test('It should return 204 and return nothing', async () => {
      const agentId = data.agents[0].real_estate_agent_id;
      const response = await request.delete(`${url}/${agentId}`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      
    });
  });
});