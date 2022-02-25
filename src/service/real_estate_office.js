const config = require('config');
const {getChildLogger} = require('../core/winston_logging');
const officeRepo = require('../repository/real_estate_office');
const ServiceError = require('../core/serviceError');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('office-service');
	this.logger.debug(message, meta);
};

const findAllOffices = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all offices', {limit, offset });
  const data = await officeRepo.findAllOffices({limit, offset});

  return { data, limit, offset };
};

const findById = (office_id) => {
  const officeId = officeRepo.findById(office_id);

  if (!officeId) {
    throw ServiceError.notFound(`No office with id ${officeId}`, { officeId });
  } else {
    debugLog(`Fetching office with id: ${office_id}`);
    return officeId;
  }
};

const create = ({
  location_id,
  office_id,
}) => {
 const newOffice = { location_id, office_id };
 debugLog(`Creating new office`, newOffice);
 return officeRepo.create(newOffice);
};

const updateById = (office_id, { location_id }) => {
  const updatedOffice = { location_id };
  debugLog(`Updated office with id: ${office_id}`, updatedOffice);
  return officeRepo.updateById(office_id, updatedOffice);
};

const deleteById = async (office_id) => {
  const officeId = await officeRepo.deleteById(office_id);

  if (!officeId){
    throw ServiceError.notFound(`No office with id: ${office_id}`, {office_id});
  }

};

module.exports = {
  findAllOffices,
  findById,
  create,
  updateById,
  deleteById,
};