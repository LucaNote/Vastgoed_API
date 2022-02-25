const Router = require('@koa/router');
const officeService = require('../service/real_estate_office');
const { requireAuthentication } = require('../core/auth');
const Joi = require('joi');
const validate = require('./_validation');

const findAllOffices = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await officeService.findAllOffices();
};
findAllOffices.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const findOfficeById = async (ctx) => {
  ctx.body = await officeService.findById(ctx.params.id);
};
findOfficeById.validationScheme = {
  params: {
    real_estate_office_id: Joi.string().uuid(),
  },
};

const createOffice = async (ctx) => {
  const newRegion = await officeService.create(ctx.request.body);
  ctx.body = newRegion;
  ctx.status = 201;
};
createOffice.validationScheme = {
  body: {
    real_estate_office_id: Joi.string().uuid(),
    location_id: Joi.string().uuid(),
  },
};

const updateOfficeById = async (ctx) => {
  ctx.body = await officeService.updateById(ctx.params.id, ctx.request.body);
};
updateOfficeById.validationScheme = {
  params: {
    real_estate_office_id: Joi.string().uuid(),
  },
  body: {
    location_id: Joi.string().uuid(),
  },
};

const deleteOfficeById = async (ctx) => {
    await officeService.deleteById(ctx.params.id);
    ctx.status = 204;
};
deleteOfficeById.validationScheme = {
  params: {
    real_estate_office_id: Joi.string().uuid(),
  },
};

module.exports = function installOfficesRoutes (app) {
	const router = new Router({
		prefix: '/real_estate_offices',
	});

  const requireAdmin = makeRequireRole(Role.ADMIN);

	router.get('/',requireAuthentication, validate(findAllOffices.validationScheme),findAllOffices);
  router.get('/:id',requireAuthentication, validate(findOfficeById.validationScheme),findOfficeById);
	router.post('/',requireAuthentication,requireAdmin,validate(createOffice.validationScheme), createOffice);
	router.put('/:id',requireAuthentication,requireAdmin,validate(updateOfficeById.validationScheme), updateOfficeById);
	router.delete('/:id',requireAuthentication,requireAdmin,validate(deleteOfficeById.validationScheme), deleteOfficeById);

	app.use(router.routes()).use(router.allowedMethods());
};