const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries in every table
    await knex(tables.real_estate_agent).delete();
    await knex(tables.real_estate_office).delete();
    await knex(tables.user).delete();
    await knex(tables.region).delete();
    await knex(tables.building).delete();
    
  },
};