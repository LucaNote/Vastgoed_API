const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.region , (region) => {
  
      region.string('city',255).primary();

      region.integer('total_buildings').notNullable();

      region.uuid('real_estate_office_id').notNullable();
      
      region.foreign('real_estate_office_id','fk_region_real_estate_office_id')
      .references(`${tables.real_estate_office}.real_estate_office_id`)
      .onDelete('CASCADE');
      
    });
  },
  down: (knex) => {
      return knex.schema.dropTableIfExists(tables.region);
  },
};