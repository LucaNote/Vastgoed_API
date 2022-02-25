const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.real_estate_office, (real_estate_office) => {
  
      real_estate_office.uuid('real_estate_office_id').primary();

      real_estate_office.uuid('location_id').notNullable();
      
    });
  },
  down: (knex) => {
      return knex.schema.dropTableIfExists(tables.real_estate_office);
  },
};