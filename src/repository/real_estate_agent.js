const uuid = require('uuid');
const {getChildLogger} = require('../core/winston_logging');
const {tables,getKnex} = require('../data/index');



// Finds all real estate agents in database
const findAllAgents = ({
  limit,
  offset
}) => {

  return getKnex()(tables.real_estate_agent)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('real_estate_agent_id', 'ASC');

};

// Finds specific real estate agent
const findById = (real_estate_agent_id) => {

  return getKnex()(tables.real_estate_agent)
    .where('real_estate_agent_id', real_estate_agent_id)
    .first();

};

// Creates a new real estate agent
const create = async ({
  name,
  email,
  office_id
}) => {
  try {
    const real_estate_agent_id = uuid.v4();
    await getKnex()(tables.real_estate_agent).insert({
      real_estate_agent_id,
      name,
      email,
      office_id,
    });
    return await findById();
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in create', {
      error
    });
    throw error;
  }
};

// Updates an existing real estate agent it's info
const updateById = async (real_estate_agent_id, {
  name,
  email,
  office_id
}) => {
  try {
    await getKnex()(tables.real_estate_agent).update({
      name,
      email,
      office_id
    }).where('real_estate_agent_id', real_estate_agent_id);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in updateById', {
      error
    });
    throw error;
  }
};

// deletes an existing real estate agent from the database
const deleteById = async (real_estate_agent_id) => {
  try {
    const rowsAffected =
      await getKnex()(tables.real_estate_agent)
    .delete()
    .where('real_estate_agent_id', real_estate_agent_id);

    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in deleteById', {
      error
    });
    throw error;
  }
};

module.exports = {
  findAllAgents,
  findById,
  create,
  updateById,
  deleteById
};