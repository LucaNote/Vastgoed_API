const uuid = require('uuid');
const {getChildLogger} = require('../core/winston_logging');
const {tables,getKnex} = require('../data/index');


// Returns all offices listed in the database
const findAllOffices = ({
  limit,
  offset
}) => {

  return getKnex()(tables.real_estate_office)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('office_id', 'ASC');

};
// Finds a specific office
const findById = (office_id) => {

  return getKnex()(tables.real_estate_office)
    .where('office_id', office_id)
    .first();

};

// Creates a new office in the database
const create = async ({
    location_id
}) => {
  try {
    const office_id = uuid.v4();
    await getKnex()(tables.real_estate_office).insert({
      location_id,
      office_id,
    });
    return await findById(office_id);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in create', {
      error
    });
    throw error;
  }
};


// Updates an existing office's info
const updateById = async (office_id, {
  location_id
}) => {
  try {
    await getKnex()(tables.real_estate_office).update({
  location_id,
  office_id
    }).where('office_id', office_id);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in updateById', {
      error
    });
    throw error;
  }
};

// Deletes an office from the database
const deleteById = async (office_id) => {
  try {
    const rowsAffected = await getKnex()(tables.real_estate_office).delete().where('office_id', office_id);
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
  findAllOffices,
  findById,
  create,
  updateById,
  deleteById
};