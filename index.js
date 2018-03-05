const Smock = require('./src/index.js')
const apis = require('./config/apis.json');
const rules = require('./config/rule.js');
const base = require('./config/base.json');

Smock(apis, rules, base);