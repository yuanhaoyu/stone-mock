module.exports = [
    {
        path: 'login',
        method: 'post',
        type: 'function',
        value: function(ex) {
            a
            const name = ex.body.username;
            const pwd = ex.body.password;
            if (name === 'houn' && pwd === '123') {
                return {
                    username: 'houn',
                    userImg: 'https://www.llamastudio.cn/static/img/bs/tx.jpg',
                    userId: '102123122'
                }
            } else {
                return {
                    '@error': {
                        code: 'xx',
                        msg: 'xxx'
                    }
                }
            }
        }
    },
    {
        path: '/user/doLogout/:id',
        method: 'get',
        type: 'function',
        value: function(ex) {
            console.log(ex.params.id);
        }
    },
    {
        path: '/user/test',
        method: 'get',
        type: 'function',
        value: function(ex) {
            console.log(ex.query.id);
        }
    }
]