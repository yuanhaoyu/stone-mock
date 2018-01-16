const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const configs = require('../config/api.json');
const rules = require('../config/rule.js');
const base = require('../config/base.json')

const app = new Koa();
const router = new Router();

app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(base.port || 3000, () => {
    console.log('app is on server');
})

configs.map(data => {
    let method = data.method ? data.method : 'get'
    switch (method.toLocaleLowerCase()) {
        case 'post':
            router.post(data.url, (ctx, next) => { 
                let result = setData(data.data);                
                if (data.rule) {
                    result = rules[data.rule] (result, ctx);
                }
                ctx.body = result;
            });
            break;
        case 'delete':
 v
            break;
        case 'update':
            router.update(data.url, (ctx, next) => { 
                let result = setData(data.data);                
                if (data.rule) {
                    result = rules[data.rule] (result, ctx);
                }
                ctx.body = result;
            });
            break;
        case 'get':
            router.get(data.url, (ctx, next) => {
                let result = setData(data.data);                
                if (data.rule) {
                    result = rules[data.rule] (result, ctx);
                }
                ctx.body = result;
            });
            break;
        default:
            router.get(data.url, (ctx, next) => {
                let result = setData(data.data);                
                if (data.rule) {
                    result = rules[data.rule] (result, ctx);
                }
                ctx.body = result;
            })
            break;
    }
})

// -- data set --
function setData (data) {
    return JSON.parse(JSON.stringify(data).replace(/:"@r"/g, ':"' + randomStr(base.random || 5) + '"'));
}

function randomStr(n = 1) {
    let t = base.randomSource || 'abc';
    let reslut = t.charAt(Math.random() * 36 - 1 );
    for (let i = 1 ; i < n; i++) {
        reslut = reslut + t.charAt(Math.random() * 36 - 1 );
    }
    return reslut;
}
