const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.building, (building) => {
      building.uuid('building_id').primary();

      building.uuid('location_id').notNullable();

      building.string('street',255).notNullable();

      building.integer('building_number').notNullable();
      
      building.integer('price').notNullable();     

      building.uuid('real_estate_office_id').notNullable();
        
      building.foreign('real_estate_office_id','fk_building_real_estate_office_id')
        .references(`${tables.real_estate_office}.real_estate_office_id`)
        .onDelete('CASCADE');

      
    });
  },
  down: (knex) => {
      return knex.schema.dropTableIfExists(tables.building);
  },
};