const Router = require('@koa/router');
const agentService = require('../service/real_estate_agent');
const { requireAuthentication } = require('../core/auth');
const Joi = require('joi');
const validate = require('./_validation');

const findAllAgents = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await agentService.findAllAgents();
};
findAllAgents.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const findAgentById = async (ctx) => {
  ctx.body = await agentService.findById(ctx.params.id);
};
findAgentById.validationScheme = {
  params: {
    real_estate_agent_id: Joi.string().uuid(),
  },
};

const createAgent = async (ctx) => {
  const newRegion = await agentService.create(ctx.request.body);
  ctx.body = newRegion;
  ctx.status = 201;
};
createAgent.validationScheme = {
  body: {
    name: Joi.string(),
    email: Joi.string().email(),
    office_id: Joi.string().uuid(),
  },
};

const updateAgentById = async (ctx) => {
  ctx.body = await agentService.updateById(ctx.params.id, ctx.request.body);
};
updateAgentById.validationScheme = {
  params: {
    real_estate_agent_id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string(),
    email: Joi.string().email(),
    office_id: Joi.string().uuid(),
  },
};

const deleteAgentById = async (ctx) => {
    await agentService.deleteById(ctx.params.id);
    ctx.status = 204;
};
deleteAgentById.validationScheme = {
  params: {
    real_estate_agent_id: Joi.string().uuid(),
  },
};

module.exports = function installAgentsRoutes (app) {
	const router = new Router({
		prefix: '/real_estate_agents',
	});

  const requireAdmin = makeRequireRole(Role.ADMIN);

	router.get('/',requireAuthentication, validate(findAllAgents.validationScheme),findAllAgents);
  router.get('/:id',requireAuthentication, validate(findAgentById.validationScheme),findAgentById);
	router.post('/',requireAuthentication, requireAdmin,validate(createAgent.validationScheme),createAgent);
	router.put('/:id',requireAuthentication,requireAdmin, validate(updateAgentById.validationScheme),updateAgentById);
	router.delete('/:id',requireAuthentication,requireAdmin,validate(deleteAgentById.validationScheme), deleteAgentById);

	app.use(router.routes()).use(router.allowedMethods());
};