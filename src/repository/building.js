const uuid = require('uuid');
const {getChildLogger} = require('../core/winston_logging');
const {tables,getKnex} = require('../data/index');



// Returns all buildings listed in the database
const findAllBuildings = ({
  limit,
  offset
}) => {

  return getKnex()(tables.building)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('location_id', 'ASC');

};

// Finds a specific building
const findById = (building_id) => {

  return getKnex()(tables.building)
    .where('building_id', building_id)
    .first();

};

// Creates a new building
const create = async ({
  location_id,
  street,
  building_number,
  price,
  office_id
}) => {
  try {
    const building_id = uuid.v4();
    await getKnex()(tables.building).insert({
      building_id,
      location_id,
      street,
      building_number,
      price,
      office_id,
    });
    return await findById(building_id);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in create', {
      error
    });
    throw error;
  }
};

// Updates a building's info by it's unique id
const updateById = async (building_id, {
  location_id,
  street,
  building_number,
  price
}) => {
  try {
    await getKnex()(tables.building).update({
  location_id,
  street,
  building_number,
  price
    }).where('building_id', building_id);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in updateById', {
      error
    });
    throw error;
  }
};

// Deletes a specific building from the database
const deleteById = async (building_id) => {
  try {
    const rowsAffected = await getKnex()(tables.building).delete().where('building_id', building_id);
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
  findAllBuildings,
  findById,
  create,
  updateById,
  deleteById
};