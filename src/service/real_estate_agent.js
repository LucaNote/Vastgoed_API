const config = require('config');
const { getChildLogger } = require('../core/winston_logging');
const agentRepo = require('../repository/real_estate_agent');
const ServiceError = require('../core/serviceError');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('agent-service');
	this.logger.debug(message, meta);
};

const findAllAgents = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all agents', { limit, offset });
  const data = await agentRepo.findAllAgents({limit, offset});

  return {data, limit, offset };
};

const findById = (real_estate_agent_id) => {
  const agentId = agentRepo.findById(real_estate_agent_id);
  if (!agentId){
    throw ServiceError.notFound(`No agent with id ${real_estate_agent_id}`, {real_estate_agent_id});
  } else {

  debugLog(`Fetching agent with id: ${real_estate_agent_id}`);
  return agentId;
  }
};

const create = ({
  name,
  email,
  office_id
}) => {
  const newAgent = {name, email, office_id };
  debugLog(`Creating new agent`, newAgent);

  return agentRepo.create(newAgent);
};

const updateById = (real_estate_agent_id, { name, email, office_id }) => {
  const updatedAgent = { name, email, office_id };
  debugLog(`Updating agent with id: ${real_estate_agent_id}`, updatedAgent);

  return agentRepo.updateById(real_estate_agent_id, updatedAgent);
};

const deleteById = async (real_estate_agent_id) => {
  const agentId = await agentRepo.deleteById(real_estate_agent_id);
  if (!agentId){
    throw ServiceError.notFound(`No agent with id ${real_estate_agent_id}`, {real_estate_agent_id});
  }
};

module.exports = {
  findAllAgents,
  findById,
  create,
  updateById,
  deleteById,
};