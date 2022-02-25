const uuid = require('uuid');
const {getChildLogger} = require('../core/winston_logging');
const {tables,getKnex} = require('../data/index');



// Returns all regions available in the API
const findAllRegions = ({
  limit,
  offset
}) => {

  return getKnex()(tables.region)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('city', 'ASC');

};

// Returns city which was given by user
const findById= (city) => {

  return getKnex()(tables.region)
    .where('city', city);

};

// Returns newly created City as region + new office in the new region
const create = async ({
  city,
  total_buildings,
}) => {
  try {
    const office_id = uuid.v4();
    await getKnex()(tables.region).insert({
      city,
      total_buildings,
      office_id,
    });
    return await findById(city);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in create', {
      error
    });
    throw error;
  }
};

// Updates a region's info by it's ID
const updateById = async (city, {
  total_buildings,
  office_id
}) => {
  try {
    await getKnex()(tables.region).update({
      total_buildings,
      office_id
    }).where('city', city);
  } catch (error) {
    const logger = getChildLogger('building-repo');
    logger.error('Error in updateById', {
      error
    });
    throw error;
  }
};

// Deletes a region by ID
const deleteById = async (city) => {
  try {
    const rowsAffected = await getKnex()(tables.region).delete().where('city', city);
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
  findAllRegions,
  findById,
  create,
  updateById,
  deleteById
};