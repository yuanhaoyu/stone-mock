module.exports = {
    login (data, ctx) {
        let result = {}
        if (ctx.request.body.username && ctx.request.body.username === 'test') {
            result = {
                "code": 200,
                "msg": "success",
                "data": {
                    "userid": 0000
                }
            }
        } else {
            result = {
                "code": 302,
                "msg": "fail",
                "data": {}
            }
        }   
        return result;
    }
}