const Joi = require('joi');

const JOI_OPTIONS = { 
  abortEarly: true,
  allowUnknown: true,
  context: true,
	convert: true,
	presence: 'required',
};

const cleanupJoiError = (error) => error.details.reduce((resultObj, {
	message,
	path,
	type,
}) => {
	const joinedPath = path.join('.') || 'value';
	if (!resultObj[joinedPath]) {
		resultObj[joinedPath] = [];
	}
	resultObj[joinedPath].push({
		type,
		message,
	});

	return resultObj;
}, {});

const validate = (schema) => {
  if (!schema) {
		schema = {
			query: {},
			body: {},
			params: {}
		};
	}

	return (ctx, next) => {
		const errors = {};
		if (!Joi.isSchema(schema.query)) {
			schema.query = Joi.object(schema.query || {});
		}

		const {
			error: queryError,
			value: queryValue,
		} = schema.query.validate(
			ctx.query,
			JOI_OPTIONS,
		);

    if (queryError) {
			errors.query = cleanupJoiError(queryError);
		} else {
			ctx.query = queryValue;
		}

    if (Object.keys(errors).length) {
			ctx.throw(400, 'Validation failed, check details for more information', {
				code: 'VALIDATION_FAILED',
				details: errors,
			});
		}
		

		return next();
	};
};

module.exports = validate;