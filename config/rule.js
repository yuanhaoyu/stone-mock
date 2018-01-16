module.exports = {
    test (data, ctx) {
        let t = data;
        t[2]= '萨达达萨达大厦的';
        console.log(ctx);
        return t;
    }
}