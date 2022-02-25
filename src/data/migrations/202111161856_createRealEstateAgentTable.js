const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.real_estate_agent, (real_estate_agent) => {
      real_estate_agent.uuid('real_estate_agent_id').primary();

      real_estate_agent.string('name',255).notNullable();

      real_estate_agent.string('email',255).notNullable();

      real_estate_agent.uuid('real_estate_office_id').notNullable();
        
      real_estate_agent.foreign('real_estate_office_id','fk_agent_office')
        .references(`${tables.real_estate_office}.real_estate_office_id`)
        .onDelete('CASCADE');
      
    });
  },
  down: (knex) => {
      return knex.schema.dropTableIfExists(tables.real_estate_agent);
  },
};