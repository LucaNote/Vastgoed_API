const {tables} = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.real_estate_office).delete();

    await knex(tables.real_estate_office).insert([
      {real_estate_office_id: "7f28c5f9-d711-4cd6-ac14-d13d71abff84", location_id: "7f27c5f9-d711-4cd6-ac14-d13d71abff84"},
      {real_estate_office_id: "7f28c5f9-d711-4cd6-ac13-d13d71abff84",location_id: "7f26c5f9-d711-4cd6-ac14-d13d71abff84"},
      {real_estate_office_id: "7f28c5f9-d711-4cd6-ac12-d13d71abff84",location_id: "7f25c5f9-d711-4cd6-ac14-d13d71abff84"},
    ]);
  },
};