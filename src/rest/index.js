const Router = require('@koa/router');
const installBuildingRouter = require('./_building');
const installUserRouter = require('./_user');
const installAgentRouter = require('./_real_estate_agent');
const installOfficeRouter = require('./_real_estate_office');
const installRegionRouter = require('./_region');

module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});

	installBuildingRouter(router);
  installUserRouter(router);
	installAgentRouter(router);
	installOfficeRouter(router);
  installRegionRouter(router);
	

	app.use(router.routes()).use(router.allowedMethods());
};