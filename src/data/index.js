const config = require('config');
const knex = require('knex');
const { join } = require('path');

//LOGGER
const {getChildLogger} = require('../core/winston_logging');

const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');
// global var for connection
let instanceOfKnex;

const getKnexLogger = (logger, level) => (message) => {
  if (message.sql) {
    logger.log(level, message.sql);
  } else if (message.length && message.forEach) {
    message.forEach((innerMessage) =>
      logger.log(level, innerMessage.sql ? innerMessage.sql : JSON.stringify(innerMessage)));
  } else {
    logger.log(level, JSON.stringify(message));
  }
};

async function initializeData(){
  const logger = getChildLogger('database');
  logger.info('Initializing connection to the database');

  const optionsOfKnex = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      database: DATABASE_NAME,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
    debug: isDevelopment,
    log: {
      debug: getKnexLogger(logger, 'debug'),
      error: getKnexLogger(logger, 'error'),
      warn: getKnexLogger(logger, 'warn'),
      deprecate: (method, alternative) => logger.warn('Knex reported something deprecated', {
        method,
        alternative,
      }),
    },

    migrations : {
      tableName : 'knex_meta',
      directory : join('src','data','migrations'),
    },
    seeds: {
      directory : join('src','data','seeds'),
    }
  };

instanceOfKnex = knex(optionsOfKnex);

// check connection to host, create database & reconnect connection

try {
await instanceOfKnex.raw('SELECT 1+1 AS result');
await instanceOfKnex.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
  

await instanceOfKnex.destroy();

optionsOfKnex.connection.database = DATABASE_NAME;
instanceOfKnex = knex(optionsOfKnex);
await instanceOfKnex.raw('SELECT 1+1 AS result');

} catch (error) {
    logger.error(error.message, { error });
    throw new Error('Could not initialize data layer of API');
}


// run migrations
let migrationFailed = true;
try {
  logger.info('Migrating files');
  await instanceOfKnex.migrate.latest();
  migrationFailed = false;
} catch (error) {
  logger.error('Error while migrating the database', {
    error }
  );
}

// undo last migrations if fail occurs

if(migrationFailed) {
  try {
    await instanceOfKnex.migrate.down();
  } catch (error) {
    logger.error('Error while undoing last migration', { error });
  }

  throw new Error('Migrations failed')
}

// run seed
if (isDevelopment) {
  try {
    await instanceOfKnex.seed.run();
  } catch (error) {
    logger.error('Error while seeding database', { error });
  }
}

logger.info('Connected to database');
return instanceOfKnex;
};

async function shutdownData() {
  const logger = getChildLogger('database');

  logger.info('Shutting down database connection');

  await knexInstance.destroy();
  knexInstance = null;

  logger.info('Database connection closed');
}

function getKnex() {
  if(!instanceOfKnex){
    throw new Error('Could not initialize data layer of API, before getting the Knex instance');
  } else {
    return instanceOfKnex;
  }
}

const tables = {
  user: 'users',
  real_estate_agent: 'real_estate_agents',
  building:'buildings',
  real_estate_office:'real_estate_offices',
  region: 'regions',
};


module.exports = {
initializeData,
getKnex,
tables,
shutdownData
};