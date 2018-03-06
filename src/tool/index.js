const fs = require('fs');

const randomStr = (n = 1, base) => {
    let t = base.randomSource || 'abc';
    let reslut = t.charAt(Math.random() * 36 - 1 );
    for (let i = 1 ; i < n; i++) {
        reslut = reslut + t.charAt(Math.random() * 36 - 1 );
    }
    return reslut;
}

function setData (data, base) {
    return JSON.parse(JSON.stringify(data).replace(/:"@r"/g, ':"' + randomStr(base.random || 5, base) + '"'));
}

function readfile (url, charset) {
    return new Promise ((resolve, reject) => {
        fs.readFile(url, charset,function(error, data) {
            if (error) return reject(error);
            resolve(data);
        });
    })
}

module.exports = {
    setData,
    readfile
}