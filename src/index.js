const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const Router = require('koa-router');
const cors = require('koa2-cors');
const axios = require('axios');
const serve = require("koa-static");
const bodyParser = require('koa-bodyparser');
const tool = require('./tool');
const Mock = require('mockjs');

const app = new Koa();
const router = new Router();

const default_conifg = {
    port: 3003,
    baseUrl: '',
    preview: 'apis',
    setResponse: (data) => {
        return {
            code: 200,
            msg: "success",
            data
        }
    }
}

app
    .use(bodyParser())
    .use(cors())
    .use(serve(path.join(__dirname,'../static')))
    .use(router.routes())
    .use(router.allowedMethods())

class Smock {
    constructor (data, config) {
        this.data = data;
        this.config = config;
        this.baseUrl = config && config.baseUrl || default_conifg.baseUrl;
        this.preview = config && config.preview  || default_conifg.preview;
        this.apis = [];
        this.stores = [];
    }
    _server() {
        let _port = this.config && this.config.port || default_conifg.port;
        app.listen(_port, () => {
            console.log(`
            ***             *          *              ***
            ********     ********   ********      *******
            **  ******   **    **   **    **    ****  ***
            *****  ***************************  *********
            *********  Happy use stone-mock  ************
            ****  *****************************  ********
            ** server on : http://127.0.0.1:${_port} ********
            ** apis   on : http://127.0.0.1:${_port + this.preview} *
            *********************************************   
            `);
        });
    }
    _proxyFactory(path, method, url) {
        // temp support get method
        router.get(path, async (ctx, next) => {
            await axios.get(url)
            .then(res => {
                ctx.body = res.data;
            });
        });
    }
    _dataFactory(path, method, data, mock) {
        router[method](path, (ctx, next) => {
            ctx.body = this._setResponse(data);
        });
    }
    _storeFactory(path, method, data, mock) {
        router[method](path, (ctx, next) => {
            ctx.body = this._setResponse(data);
        });
        router[method](`${path}/:id`, (ctx, next) => {
            ctx.body = this._setResponse(this._findStore(ctx.params.id, path))
        });
    }
    _functionFactory(path, method, fun) {
        router[method](path, (ctx, next) => {
            const ex = {
                ctx,
                Mock
            };
            ctx.body = this._setResponse(fun(ex));
        });
    }
    _findStore(id, path) {
        for (let i = 0 ; i < this.apis.length; i++) {
            if (this.apis[i].path == path) {
                if (this.apis[i].value.length > 0) {
                    for (let j = 0 ; j < this.apis[i].value.length; j++) {
                        if (this.apis[i].value[j].id == id) {
                            return this.apis[i].value[j];
                        }
                    }
                } else {
                    if (this.apis[i].value.id === id) {
                        return this.apis[i].value;
                    }
                }
            }
        }
        return {}
    }
    _setAllapis() {
        router.get(this.preview, async (ctx, next) => {
            ctx.type = 'html';        
            let data = await tool.readfile(path.join(__dirname,'../static/index.html'), 'utf8');
            data = data + `<script>window.APIJSONS = ${JSON.stringify(this.apis)};</script>`;
            ctx.body = data;
        });
    }
    _setApis() {
        this.apis.map(data => {
            switch(data.type) {
                case 'function':
                    this._functionFactory(data.path, data.method, data.value);
                    break;
                case 'store':
                    this._storeFactory(data.path, data.method, data.value, data.mock);
                    break;
                case 'proxy':
                    this._proxyFactory(data.path, data.method, data.value);
                    break;
                default:
                    this._dataFactory(data.path, data.method, data.value, data.mock);
                    break;
            }
        })
    }
    _setResponse(data) {
        if (this.config.setResponse) {
            return this.config.setResponse(data);
        } else {
            return default_conifg.setResponse(data);
        }
    }
    _assemblyData() {
        let data = this.data;
        for (let i in data) {
            // set url in right way
            if (data[i].path.toString().indexOf('/') !== 0) {
                data[i].path = `${this.baseUrl}/${data[i].path}`
            } else {
                data[i].path = `${this.baseUrl + data[i].path}`
            }
            // set mock
            if (data[i].mock) {
                if (data[i].value) {
                    data[i].value = Mock.mock(data[i].value);
                } else {
                    data[i] = Mock.mock(data[i]);
                }
            }
            // set method
            if (!data[i].method) {
                data[i].method = 'get'
            } else {
                data[i].method = data[i].method.toLowerCase()
            }
            // store apis
            this.apis.push(data[i]);    
        }
    }
    extend() {
        return {
            Mock
        }
    }
    init() {
        // server start
        this._server();
        // assembly & mock data
        this._assemblyData();
        // set all api and static
        this._setAllapis();
        // set apis 
        this._setApis();
    }
}

function composeFactory () {
    let res = [];
    for (let i = 0 ; i < arguments.length; i++) {
        res = res.concat(arguments[i]);
    }
    return res;
}

module.exports = {
    Smock,
    composeFactory
};