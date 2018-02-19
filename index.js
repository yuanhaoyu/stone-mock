const Smock = require('./src/index.js')
const configs = require('./config/api.json');
const rules = require('./config/rule.js');
const base = require('./config/base.json');

Smock(configs, rules, base);