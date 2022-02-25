const {tables} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.user, (user) => {
      user.string('email').notNullable();

      user.string('password_hash').notNullable();

      user.jsonb('roles').notNullable();

      user.unique('email', 'idx_user_email_unique');
    });
  },
  down: async (knex) => {
    return knex.schema.alterTable(tables.user, (table) => {
			table.dropColumns('email', 'password_hash', 'roles');
		});
  },
};