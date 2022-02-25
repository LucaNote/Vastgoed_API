const { shutdownData, getKnex, tables } = require('../src/data');

module.exports = async () => {
  await getKnex()(tables.user).delete();
  await getKnex()(tables.region).delete();
  await getKnex()(tables.building).delete();
  await getKnex()(tables.real_estate_agent).delete();
  await getKnex()(tables.real_estate_office).delete();

  await shutdownData();
}