const Router = require('@koa/router');
const regionService = require('../service/region');
const { requireAuthentication } = require('../core/auth');
const Joi = require('joi');
const validate = require('./_validation');

const findAllRegions = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await regionService.findAllRegions();
};
findAllRegions.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const findRegionById = async (ctx) => {
  ctx.body = await regionService.findById(ctx.params.id);
};
findRegionById.validationScheme = {
  params: {
    city: Joi.string().max(255),
  },
};

const createRegion = async (ctx) => {
  const newRegion = await regionService.create(ctx.request.body);
  ctx.body = newRegion;
  ctx.status = 201;
};
createRegion.validationScheme = {
  body: {
    city: Joi.string().max(255),
    total_buildings: Joi.number().integer().positive(),
    real_estate_office_id: Joi.string().uuid(),
  },
};

const updateRegionById = async (ctx) => {
  ctx.body = await regionService.updateById(ctx.params.id, ctx.request.body);
};
updateRegionById.validationScheme = {
  params: {
    city: Joi.string().max(255),
  },
  body: {
    city: Joi.string().max(255),
    total_buildings: Joi.number().integer().positive(),
    real_estate_office_id: Joi.string().uuid(),
  },
};

const deleteRegionById = async (ctx) => {
    await regionService.deleteById(ctx.params.id);
    ctx.status = 204;
};
deleteRegionById.validationScheme = {
  params: {
    city: Joi.string().max(255),
  },
};

module.exports = function installRegionsRoutes(app) {
	const router = new Router({
		prefix: '/regions',
	});
  const requireAdmin = makeRequireRole(Role.ADMIN);

	router.get('/', requireAuthentication,validate(findAllRegions.validationScheme),findAllRegions);
  router.get('/:id',requireAuthentication, validate(findRegionById.validationScheme),findRegionById);
	router.post('/',requireAuthentication,requireAdmin, validate(createRegion.validationScheme),createRegion);
	router.put('/:id', requireAuthentication,requireAdmin,validate(updateRegionById.validationScheme),updateRegionById);
	router.delete('/:id',requireAuthentication,requireAdmin,validate(deleteRegionById.validationScheme), deleteRegionById);

	app.use(router.routes()).use(router.allowedMethods());
};