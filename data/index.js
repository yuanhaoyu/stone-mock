const { composeFactory } = new require('../src/index');

// apis
const nav = require('./api/nav');
const login = require('./api/user/login');
const kind = require('./api/user/kind');
const luck = require('./api/user/luck');

// stores
const topic = require('./store/topic');
const indexPhoto = require('./store/index/photo');

module.exports = composeFactory(
    nav,
    login,
    luck,
    kind,
    topic,
    indexPhoto
);