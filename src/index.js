const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const axios = require('axios');
var bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app
    .use(bodyParser())
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())

const Smock = (configs, rules, base) => {

    app.listen(base.port || 3000, () => {
        console.log('app is on server port is ' + (base.port || 3000));
    })
    
    configs.map(data => {
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
                        let result = setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    });
                    break;
                case 'delete':
                    router.delete(data.url, (ctx, next) => { 
                        let result = setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    });
                    break;
                case 'update':
                    router.update(data.url, (ctx, next) => { 
                        let result = setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    });
                    break;
                case 'get':
                    router.get(data.url, (ctx, next) => {
                        let result = setData(data.data, base);                
                        if (data.rule) {
                            result = rules[data.rule] (result, ctx);
                        }
                        ctx.body = result;
                    });
                    break;
                default:
                    router.get(data.url, (ctx, next) => {
                        let result = setData(data.data, base);                
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

// -- data set --
function setData (data, base) {
    return JSON.parse(JSON.stringify(data).replace(/:"@r"/g, ':"' + randomStr(base.random || 5, base) + '"'));
}

function randomStr(n = 1, base) {
    let t = base.randomSource || 'abc';
    let reslut = t.charAt(Math.random() * 36 - 1 );
    for (let i = 1 ; i < n; i++) {
        reslut = reslut + t.charAt(Math.random() * 36 - 1 );
    }
    return reslut;
}

module.exports = Smock
