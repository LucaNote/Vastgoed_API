const config = require('config');
const { getChildLogger } = require('../core/winston_logging');
const regionRepo = require('../repository/region');
const ServiceError = require('../core/serviceError');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('region-service');
	this.logger.debug(message, meta);
};

const findAllRegions = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all regions', { limit, offset });
  const data = await regionRepo.findAllRegions({limit, offset});
  return { data, limit, offset };
};

const findById = (city) => {
  const regionId = regionRepo.findById(city);

  if (!regionId){
    throw ServiceError(`No region with id ${city}`, {city });
  } else {
    debugLog(`Fetching region with city: ${city}`);
  return regionId;
  }
  
};

const create = ({
  city,
  total_buildings,
  office_id
}) => {
  const newRegion = { city, total_buildings,office_id };
  debugLog('Creating new region', newRegion);
  return regionRepo.create(newRegion);
};

const updateById = (city, { total_buildings, office_id }) => {
  const updatedRegion = {total_buildings, office_id};
  debugLog(`Updated region with city: ${city}`, updatedRegion);
  return regionRepo.updateById(city, updatedRegion);
};

const deleteById = async (city) => {
  const regionId = await regionRepo.deleteById(city);

  if(!regionId){
    throw ServiceError.notFound(`No region with id ${city}`, { city });
  }
};

module.exports = {
  findAllRegions,
  findById,
  create,
  updateById,
  deleteById,
};