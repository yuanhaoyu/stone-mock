# stone-mock
---
🔧 stone-mock (Smock) 是一款基于配置的简单mock工具

##  Init

- install

```bash
npm install stone-mock
```

- Then ... happy start 🚗

```bash
npm run start
```

## Usage

超简单的配置，只需以json数组的方式写你想返回的接口的值，以及接口调用的方法，参考如下：

```javascript
[{
   "url": "/test",
   "data": [
       {"name": "2r12312"},
       {"name": 2},
       {"name": "23"},
       {"name": [
           {"test":1},
           {"test":2},
           {"test":"32"}
       ]}
   ]
}]
```
对于Smock来说，我们必要的2个最外层字段是data和url，一个代表Smock为你返回的模拟数据，一个代表Smock为你开启的接口地址。

## More

### random

在字段里面声明@r，Smock即将为你生成制定字数的随机数据。

### rule

Smock并不是很鼓励使用rule，因为你又回到了写代码处理逻辑的时候，但是在你必要的时候，你可以为你的接口增加规则（**规则这里只支持javascript代码**), 在config里面声明rule字段，然后后面写上对应的rule的函数名，最后在config目录的rule.js 写上你要制定的规则函数即可，函数接口如下：

```javascript
function test (data, ctx) {
  // do something
  return data
}
```

其中data是接口返回的模拟数据，ctx是koa-router的上下文。

详细的可以参考初始化demo

### proxy

Smock 也支持代理转发，我们默认使用axios来转发，使用转发也十分简单，在我们的api的配置里面加入这3个额外的字段，快速开始。

- proxy: Boolean类型，来确认是否开启代理。

- sourceUrl: String类型，转发接口的原地址。

- query: query会根据不同方法，作为参数。


## Base config

当然为了让你更好的离开代码，专心于各种json的配置。Smock抽离了最基本的base.json，你可以用它设置一些基础选项。

### port
	
	Smock默认开启的端口服务，默认3000

### random

	Smock默认生成随机数据的长度，默认为5

### randomSource：
	Smock生成随机数据的数据源，默认为abc


## To do

- [ x ] proxy support
- [ ] add header config
- [ ] visualizationsupport
- [ ] pm2 default support