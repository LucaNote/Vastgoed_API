const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.user, (user) => {
      user.uuid('user_id').primary();

      user.uuid('real_estate_office_id').notNullable()
        
      user.foreign('real_estate_office_id','fk_user_real_estate_office_id')
        .references(`${tables.real_estate_office}.real_estate_office_id`)
        .onDelete('CASCADE');

      

    });
  },
  down: (knex) => {
      return knex.schema.dropTableIfExists(tables.user);
  },
};