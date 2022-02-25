const config = require('config');
const {getChildLogger} = require('../core/winston_logging');
const userRepo = require('../repository/user');
const { hashPassword, verifyPassword } = require('../core/password');
const { generateJWT } = require('../core/jwt');
const Role = require('../core/roles');
const ServiceError = require('../core/serviceError');


const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};

const register = async({
  name,
  email,
  password
}) => {


const passwordHash = await hashPassword(password);
const user = await userRepo.create({
  name,
  email,
  password,
  roles : [Role.USER]
});

return await makeLoginData(user);

};

const findAllUsers = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all users', {limit, offset });
  const data = await userRepo.findAllUsers({limit, offset});

  return { data, limit, offset };
};

const getById = (user_id) => {
  const userId = userRepo.getById(user_id);
  if (!userId){
    throw ServiceError.notFound(`There is no user with id ${userId}`, { user_id });
  } else {

  
  debugLog(`Fetching user with id: ${user_id}`);
  return userId;
  }
};


const updateById = (user_id, { password, email, office_id }) => {
  const updatedUser = { password, email, office_id };
  debugLog(`Updating user with id: ${user_id}`, updatedUser);
  return userRepo.updateById(user_id, updatedUser);
};

const deleteById = async (user_id) => {
  const userId = await userRepo.deleteById(user_id);
  if (!userId){
    throw ServiceError.notFound(`There is no user with id ${userId}`, { user_id });
  }
};

const makeExposedUser = ({ id, name, email, roles }) => ({
	id,
	name,
	email,
	roles,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token
  };
};
const login = async (email, password) => {
  const user = await userRepo.findById(email);

  if (!user){
    throw ServiceError.unauthorized('The given email and password do not match');
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid){
    throw ServiceError.unauthorized('The given email and password do not match');
  }
  return await makeLoginData(user);
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
		throw ServiceError.unauthorized('You need to be signed in');
	}

	if (!authHeader.startsWith('Bearer ')) {
		throw ServiceError.unauthorized('Invalid authentication token');
	}

	const authToken = authHeader.substr(7);
	try {
		const {
			roles, userId,
		} = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };

	} catch (error) {
		const logger = getChildLogger('user-service');
		logger.error(error.message, { error });
		throw ServiceError.unauthorized(error.message);
	}
};

const checkRole = (role, roles) => {
	const hasPermission = roles.includes(role);

	if (!hasPermission) {
		throw ServiceError.forbidden('You are not allowed to view this part of the application');
	}
};

module.exports = {
  register,
  findAllUsers,
  getById,
  updateById,
  deleteById,
  login,
};