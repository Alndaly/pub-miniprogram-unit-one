// wx异步方法Promise化
function promisify(fn) {
    // promisify() 返回的是一个函数，
    return async function (args) {
        return new Promise((resolve, reject) => {
            fn({
                ...(args || {}),
                success: res => resolve(res),
                fail: err => reject(err)
            });
        });
    };
}

// 群体一次性异步处理
// 这里 names 期望是一个数组
function toAsync(...names) {
    return (names || [])
        .map(name => ({
            name,
            member: wx[name]
        }))
        .filter(t => typeof t.member === "function")
        .reduce((r, t) => {
            r[t.name] = promisify(wx[t.name]);
            return r;
        }, {});
}

module.exports = {
    promisify,
    toAsync
}