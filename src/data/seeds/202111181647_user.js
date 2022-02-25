const {tables} = require('..');
const Role = require('../../core/roles');

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete();

    await knex(tables.user).insert([
      {
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac14-d13d71abff84',
        email : 'user084@outlook.com',
        password_hash :
         '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.ADMIN]),
      },
      {
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac13-d13d71abff84',
        email : 'user085@outlook.com',
        password_hash :
        '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER]),
      },
      {
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
        real_estate_office_id: '7f28c5f9-d711-4cd6-ac12-d13d71abff84',
        email : 'user086@outlook.com',
        password_hash :
        '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER]),
      },
    ])
  },
};