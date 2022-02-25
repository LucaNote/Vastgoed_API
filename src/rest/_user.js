const Router = require('@koa/router');
const userService = require('../service/user');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Joi = require('joi');
const validate = require('./_validation');

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
	const session = await userService.login(email, password);
	ctx.body = session;
};
login.validationScheme = {
  body : {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

const findAllUsers = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await userService.findAllUsers();
};
findAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const findUserById = async (ctx) => {
  ctx.body = await userService.findById(ctx.params.id);
};
findUserById.validationScheme = {
  params: {
    user_id: Joi.string().uuid(),
  },
};


const updateUserById = async (ctx) => {
  ctx.body = await userService.updateById(ctx.params.id, ctx.request.body);
};
updateUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    office_id: Joi.string().uuid(),
  },
};

const deleteUserById = async (ctx) => {
    await userService.deleteById(ctx.params.id);
    ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
	ctx.body = session;
};
register.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

module.exports = function installUsersRoutes(app) {
	const router = new Router({
		prefix: '/users',
	});

  const requireAdmin = makeRequireRole(Role.ADMIN);

	router.get('/',requireAuthentication ,requireAdmin,validate(findAllUsers.validationScheme),findAllUsers);
  router.get('/:id', requireAuthentication ,requireAdmin,validate(findUserById.validationScheme),findUserById);
	router.put('/:id', requireAuthentication ,requireAdmin,validate(updateUserById.validationScheme),updateUserById);
	router.delete('/:id', requireAuthentication ,requireAdmin,validate(deleteUserById.validationScheme),deleteUserById);

  // public calls
  router.post('/login', validate(login.validationScheme),login);
  router.post('/register', validate(register.validationScheme),register);

	app.use(router.routes()).use(router.allowedMethods());
};