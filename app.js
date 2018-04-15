const datas = require('./data');
const { Smock } = require('./src/index.js');

const config = {
    port: 3005,
    baseUrl: '',
    preview: '/preview'
}
var smock = new Smock(datas, config);
smock.init();
