const {tables} = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.real_estate_agent).delete();

    await knex(tables.real_estate_agent).insert([
      {real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff74', name: 'agent001', email: 'agent001@office02.com', real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'},
      {real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff64', name: 'agent002', email: 'agent007@office01.com', real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'},
      {real_estate_agent_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff54', name: 'agent003', email: 'agent023@office01.com', real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'},
    ]);
  },
};