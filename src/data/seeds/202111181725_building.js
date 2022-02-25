const {tables} = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.building).delete();

    await knex(tables.building).insert([
      {building_id: '7f28c5f9-d712-4cd6-ac15-d13d71abff84',location_id: '7f28c5f9-d711-4cd5-ac15-d13d71abff84', street: 'Elfde-julistraat', building_number: 159 ,price: 190000 ,real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84'},
      {building_id:'7f28c5f9-d710-4cd6-ac15-d13d71abff84',location_id: '7f28c5f9-d711-4cd4-ac15-d13d71abff84', street: 'Fonteinstraat', building_number: 24 ,price: 340000 ,real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84'},
      {building_id:'7f28c5f9-d709-4cd6-ac15-d13d71abff84',location_id: '7f28c5f9-d711-4cd3-ac15-d13d71abff84', street: 'Straat-Te-Gent', building_number: 148 ,price: 253000 ,real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84'},
    ]);
  },
};