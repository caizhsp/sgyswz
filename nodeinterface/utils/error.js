function Msg(option) {
    return {
        "msg": option.msg || "404页面丢失",
        "code": option.code || 500,
        "result": option.result || null
    }
}

module.exports = {
    Msg
}