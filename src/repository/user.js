const uuid = require('uuid');
const {getChildLogger} = require('../core/winston_logging');
const {tables,getKnex} = require('../data/index');


// Returns all users listed in the database
const findAllUsers = ({
  limit,
  offset
}) => {

  return getKnex()(tables.user)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('user_id', 'ASC');

};
// Finds a specific user
const findById = (user_id) => {

  return getKnex()(tables.user)
    .where('user_id', user_id)
    .first();

};

// Creates a new user in the database
const create = async ({
    office_id,
    email,
    passwordHash,
    roles,
}) => {
  try {
    const user_id = uuid.v4();
    await getKnex()(tables.user).insert({
      user_id,
      office_id,
      password_hash: passwordHash,
      email,
      roles: JSON.stringify(roles)
      
    });
    return await findById(user_id);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in create', {
      error
    });
    throw error;
  }
};


// Updates an existing user's info
const updateById = async (user_id, {
  password,
  email,
  office_id
}) => {
  try {
    await getKnex()(tables.user).update({
  password,
  email,
  office_id
    }).where('user_id', user_id);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in updateById', {
      error
    });
    throw error;
  }
};

// Deletes a user from the database
const deleteById = async (user_id) => {
  try {
    const rowsAffected = await getKnex()(tables.user).delete().where('user_id', user_id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in deleteById', {
      error
    });
    throw error;
  }
};

const findByEmail = (email) => {
  return getKnex()(tables.user)
  .where('email',email)
  .first();
};

module.exports = {
  findAllUsers,
  findById,
  create,
  updateById,
  deleteById,
  findByEmail
};