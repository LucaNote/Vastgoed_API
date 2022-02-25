const Router = require('@koa/router');
const buildingService = require('../service/building');
const { requireAuthentication } = require('../core/auth');
const Joi = require('joi');
const validate = require('./_validation');

const findAllBuildings = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await buildingService.findAllBuildings(limit,offset);
};
findAllBuildings.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const findBuildingById = async (ctx) => {
  ctx.body = await buildingService.findById(ctx.params.id);
};
findBuildingById.validationScheme = {
params : {
  building_id : Joi.string().uuid(),
},
};

const createBuilding = async (ctx) => {
  const newBuilding = await buildingService.create(ctx.request.body);
  ctx.body = newBuilding;
  ctx.status = 201;
};
createBuilding.validationScheme = {
  body : {
    location_id: Joi.string().uuid(),
    street: Joi.string(),
    building_id: Joi.string().uuid(),
    price: Joi.number().invalid(0),
    office_id: Joi.string().uuid(),
  },
};

const updateBuildingById = async (ctx) => {
  ctx.body = await buildingService.updateById(ctx.params.id, ctx.request.body);
};
updateBuildingById.validationScheme = {
  params: {
    building_id : Joi.string().uuid(),
  },
  body : {
    location_id: Joi.string().uuid(),
    street: Joi.string(),
    building_id: Joi.string().uuid(),
    price: Joi.number().invalid(0),
    office_id: Joi.string().uuid(),
  },
};

const deleteBuildingById = async (ctx) => {
    await buildingService.deleteById(ctx.params.id);
    ctx.status = 204;
};
deleteBuildingById.validationScheme = {
  params : {
    building_id: Joi.string().uuid(),
  },
};

module.exports = function installBuildingsRoutes (app) {
	const router = new Router({
		prefix: '/buildings',
	});

  const requireAdmin = makeRequireRole(Role.ADMIN);

	router.get('/', requireAuthentication,validate(findAllBuildings.validationScheme),findAllBuildings);
  router.get('/:id',requireAuthentication,validate(findBuildingById.validationScheme), findBuildingById);
	router.post('/',requireAuthentication,requireAdmin, validate(createBuilding.validationScheme),createBuilding);
	router.put('/:id',requireAuthentication, requireAdmin,validate(updateBuildingById.validationScheme),updateBuildingById);
	router.delete('/:id',requireAuthentication,requireAdmin, validate(deleteBuildingById.validationScheme),deleteBuildingById);

	app.use(router.routes()).use(router.allowedMethods());
};
