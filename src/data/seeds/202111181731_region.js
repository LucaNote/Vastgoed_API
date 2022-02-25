const {tables} = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.region).delete();

    await knex(tables.region).insert([
      {city: "Gent", total_buildings: 4 ,real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'},
      {city: "Kortrijk", total_buildings: 7 ,real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'},
      {city: "Menen", total_buildings: 2 ,real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'},
    ])
  },
};