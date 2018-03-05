const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const cors = require('koa2-cors');
const axios = require('axios');
const serve = require("koa-static");
var bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const tool = require('./tool');

app
    .use(bodyParser())
    .use(cors())
    .use(serve(path.join(__dirname,'../static')))
    .use(router.routes())
    .use(router.allowedMethods())

const Smock = (apis, rules, base) => {

    app.listen(base.port || 3000, () => {
        console.log('Server start: http://127.0.0.1:' + (base.port || 3000));
    })
    
    /**
     * router -- all api.json
     */

    router.get('/allApi', async (ctx, next) => {
        ctx.body = apis;           
    });  

    /**
     * otherRouter 
     */
    apis.map(data => {
        let method = data.method ? data.method : 'get';
        if (data.proxy) {
            switch (method.toLocaleLowerCase()) {
                case 'post':
                    router.post(data.url, async (ctx, next) => {
                        await axios.post(data.sourceUrl, data.query)
                        .then(res => {
                            ctx.body = res;
                        })                 
                    });   
                    break;
                case 'get':
                    router.get(data.url, async (ctx, next) => {
                        await axios.get(data.sourceUrl + (data.query ? `?${data.query}` : ''))
                        .then(res => {
                            ctx.body = res.data;
                        }); 
                    });
                    break;
                default:
                    router.get(data.url, async (ctx, next) => {
                        await axios.get(data.sourceUrl + data.query ? `?${data.query}` : '')
                        .then(res => {
                            ctx.body = res;
                        })                 
                    });
                    break;
            }
        } else {
            switch (method.toLocaleLowerCase()) {
                case 'post':
                    router.post(data.url, (ctx, next) => { 
                        let result = tool.setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    });
                    break;
                case 'delete':
                    router.delete(data.url, (ctx, next) => { 
                        let result = tool.setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    });
                    break;
                case 'update':
                    router.update(data.url, (ctx, next) => { 
                        let result = tool.setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    });
                    break;
                case 'get':
                    router.get(data.url, (ctx, next) => {
                        let result = tool.setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    });
                    break;
                default:
                    router.get(data.url, (ctx, next) => {
                        let result = tool.setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    })
                    break;
            }
        }
    })
}

module.exports = Smock
