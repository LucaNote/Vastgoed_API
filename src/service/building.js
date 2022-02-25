const config = require('config');
const { getChildLogger } = require('../core/winston_logging');
const buildingRepo = require('../repository/building');
const ServiceError = require('../core/serviceError');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('building-service');
	this.logger.debug(message, meta);
};

const findAllBuildings = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all buildings', { limit, offset });
  const data = await buildingRepo.findAllBuildings({limit, offset});
  return {data, limit, offset};
};

const findById = (building_id) => {
  const buildingId = buildingRepo.findById(building_id);
  if(!buildingId){
    throw ServiceError.notFound(`No building with id ${buildingId}`, { building_id });
  } else {
    debugLog(`Fetching building with id ${building_id}`);
    return buildingId;
  }
};

const create = ({
  location_id,
  street,
  building_number,
  price,
  office_id
}) => {
  const newBuilding = { location_id, street, building_number, price, office_id };
  debugLog('Creating new building', newBuilding);
  return buildingRepo.create(newBuilding);
};

const updateById = (building_id, { location_id, street, building_number, price, office_id }) => {
  const updatedBuilding = {location_id, street, building_number, price, office_id};
  debugLog(`Updated building with ${building_id}`, updatedBuilding);
  return buildingRepo.updateById(building_id, updatedBuilding);
};

const deleteById = async (building_id) => {
  const buildingId = await buildingRepo.deleteById(building_id);
  
  if(!buildingId){
    throw ServiceError.notFound(`No building with id ${buildingId}`, { building_id });
  }
};

module.exports = {
  findAllBuildings,
  findById,
  create,
  updateById,
  deleteById,
};