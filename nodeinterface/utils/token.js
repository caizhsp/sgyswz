const jwt = require('jsonwebtoken')
const secretKey = "我是秘钥"

function setToken(data) { // 设置token的时候，data只能是option，字符串和数组都不行
    return jwt.sign(data, secretKey, { expiresIn: 1 * 60 });
}

function verifyToken(token) {
    try { // 使用try_catch捕捉错误并进行对应的结果返回
        return jwt.verify(token, secretKey)
    } catch (error) {
        return false
    }
}

module.exports = {
    setToken,
    verifyToken
}