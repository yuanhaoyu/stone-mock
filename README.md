# stone-mock
[![stone-mock](https://img.shields.io/badge/stone--mock-v2.0.1-orange.svg)](https://www.npmjs.com/package/stone-mock)

stone-mock (Smock) 是一款基于配置的简单易扩展的mock工具🔧 

##  Installation

### NPM


```bash
npm install stone-mock
```

### Git

```bash
git clone https://github.com/yuanhaoyu/stone-mock.git

cd stone-mock && npm install

```


## Usage

### NPM

new a file named<code>app.js</code>

```javascript
const { Smock } = require('stone-mock');

const config = {
    port: 3005,
    baseUrl: '',
    preview: '/preview'
}

const datas = [
  {
    path: '/test',
    type: 'data',
    value: {
     test: 'test'
    }
  }
]

const smock = new Smock(datas, config);
smock.init();
```

then happy start 🚗

```bash
node app.js
```
### Git

```bash
npm run start
```

## Smock(datas, config)


### datas

smock接受一个数组作为datas用来生成apis，datas的每一项，Smock也有严格的规定，他必须是一个对象并且拥有以下属性

- path
- type
- vaule
- method
- mock

#### path
path就是你定义的api地址

#### type
type是一个可选择的属性，他支持"function" || "store" || "data" || "proxy" 四种类型。

- function 默认参数为ex，你可以用ex.ctx访问koa的上下文，也可以ex.Mock自定义mock，为了你更方便的在function里随心所欲，我们同样封装了ex.query 可获取get请求参数，ex.body 可获取post请求参数，ex.params 可获取url参数。[**ex.query/ex.body/ex.params 均返回一个对象**]

- store 使用store后，会以restful的模式自动创建，一级子资源接口。如下：

```javascript
{
  'path': '/user',
  'type': 'store',
  'value': [
    {
      id: 1,
      name: 'sam'
    },
    {
     id: 2,
     name: 'amy'
    }
  ]
}
```
当你访问/user的时候就得到上面value的结果，当你访问/user/1 就自动获取id=1的那条内容

- proxy: 将value中填入你要代理的url（当前只支持get方式的）
- data: 模拟数据，type的默认值。

#### value
模拟接口返回的值

#### method
method即调用接口的方法，默认为get，如果想支持所有方法，请设置为"all"

#### mock
即是否开启mock模式，他是一个Boolean，默认为false，当为true即开启mock模式，可以使用mockjs的语法进行mock。

---

### config

smock接受一个对象作为config用来配置，其中包括

- port : Number 
- baseUrl : String 
- preview : String 
- setResponse : Function

#### port
Smock服务使用的端口，默认为3003

#### baseUrl
所有接口的前置url，默认为空

#### preview
接口可视化页面的路由，默认为/apis

#### setResponse
统一处理接口返回的格式，默认为

```javascript
 {
      code: 200,
      msg: "success",
      data: "mock value"
  }
```
当然你或许想要根据不同的输入得到不同的code返回，这里就需要<code>@error</code>配合<code>type: 'function' </code>使用，如下面这个登录的例子。

```javascript
{
  path: 'login',
  method: 'post',
  type: 'function',
  value: function(ex) {
    if (ex.body.username === 'houn' && ex.body.password === '123') {
      return {
        username: 'houn',
        userId: '102123122'
       }
     } else {
       return {
         '@error': {
           code: '203',
           msg: '登录失败'
          }
        }
     }
   }
}
```
只要你的返回中含有@error时，我们会直接获取@error的值作为你的返回，所以一定要谨慎使用**@error 字段**。

## init
完成Smock的实例化后，我们可以用init方法来开启服务。

```javascript
const smock = new Smock(datas, config);
smock.init();
```

## composeFactory
为了更好的管理接口，Smock建议将相关接口作为一个单独文件，然后用module.exports = [] 的方法将其导出，然后Smock提供composeFactory方法将多个数组合并成一个。


```javascript
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
```

## Visualization
**Smock支持可视化查看所有接口**

默认情况访问**127.0.0.1:端口号/apis**,即可查看你设置的Smock。

