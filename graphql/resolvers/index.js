const authResolver = require('./auth');
const charProfileResolver = require('./charProfiles');

const rootResolver = {
    ...authResolver,
    ...charProfileResolver
};

module.exports = rootResolver;
