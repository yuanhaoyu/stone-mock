const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const configs =require('./config/index.json');

const app = new Koa();
const router = new Router();

app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(3000, () => {
    console.log('app is on server');
})

//  ---
configs.map(data => {
    switch (data.method) {
        case 'post':
            router.get(data.url, (ctx, next) => { 
                ctx.body = data.data;
            });
            break;
        case 'delete':
            router.delete(data.url, (ctx, next) => { 
                ctx.body = data.data;
            });
            break;
        case 'update':
            router.update(data.url, (ctx, next) => { 
                ctx.body = data.data;
            });
            break;
        case 'get':
            router.get(data.url, (ctx, next) => { 
                ctx.body = data.data;
            });
            break;
        default:
            router.get(data.url, (ctx, next) => {
                let result = setData(data.data)
                ctx.body = result;
            })
            break;
    }
})

// -- data set --
function setData (data) {
    let reslut = [];
    data.map(data => {
        reslut.push(JSON.parse(JSON.stringify(data).replace(/:"@r"/g, ':"' + randomStr(5) + '"')));
    })
    return reslut;
}

function randomStr(n = 1) {
    let t = 'qwertyuiopalksjdfhgmzxncvb1234567890';
    let reslut = t.charAt(Math.random() * 36 - 1 );
    for (let i = 1 ; i < n; i++) {
        reslut = reslut + t.charAt(Math.random() * 36 - 1 );
    }
    return reslut;
}

function deepSearch (data) {
    if (typeof data === 'object') {
        let temp = []
        for (var i in data) {
            if (data[i] === '@r') {
                temp.push(i)
            }
        }
        return i
    }
}
