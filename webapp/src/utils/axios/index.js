// 引进实例
import http from './axios'

// 注册接口
export function register(data) {
    return http.post("/api/register", data)
}
// 验证码接口
export function code() {
    return http.get("/api/captcha")
}

// 登录接口
export function login(data) {
    return http.post("/api/login", data)
}

// 添加影视剧资料接口
export function addmov(data) {
    return http.post("/api/addmov", data)
}

// 添加演员资料接口
export function addartist(data) {
    return http.post("/api/artistadd", data)
}

// 添加影片描述接口
export function adddetails(data) {
    return http.post("/api/adddetails", data)
}

// 查询影视剧详情接口
export function getdetails(mid) {
    return http.get("/api/getdetails", {
        params: {
            mid
        }
    })
}

// 搜索页获取电影列表接口
export function getmovlist() {
    return http.get("/api/getmovlist")
}

// 搜索影视接口
export function search(keyword) {
    return http.get("/api/movsearch", {
        params: {
            keyword
        }
    })
}

// 热榜
export function hot(sort) {
    return http.get("/api/hot", {
        params: {
            sort
        }
    })
}

// 新榜
export function _new(sort) {
    return http.get("/api/new", {
        params: {
            sort
        }
    })
}

// top榜
export function top(sort) {
    return http.get("/api/top", {
        params: {
            sort
        }
    })
}

// 推荐榜
export function commend() {
    return http.get("/api/commend")
}

// 查询分类信息
export function getsort() {
    return http.get("/api/getsort")
}

// 获取对应分类下的信息
export function sort(sort) {
    return http.get("/api/sort", {
        params: {
            sort
        }
    })
}

// 添加评论
export function commentadd(data) {
    return http.post("/api/commentadd", data)
}

// 查询短评
export function commentshort(params) {
    return http.get("/api/commentshort", {
        params
    })
}

// 查询长评
export function commentlong(params) {
    return http.get("/api/commentlong", {
        params
    })
}

// 获取评论总数接口
export function commentCount(mid) {
    return http.get("/api/commentCount", {
        params: {
            mid
        }
    })
}

// 查询个人评论
export function getMyCom(params) {
    return http.get("/api/getMyCom", {
        params
    })
}

// 删除个人评论
export function delMyCom(com_id) {
    return http.get("/api/comDel", {
        params: {
            com_id
        }
    })
}

// 编辑个人资料
export function edit(data) {
    return http.post("/api/edit", data)
}

// 影片收藏
export function movcollect(data) {
    return http.post("/api/movcollect", data)
}

// 获取个人收藏
export function getMyCollects(data) {
    return http.post("/api/getMyCollects", data)
}

// 获取用户资料
export function getUserInfo(data) {
    return http.post("/api/getUserInfo", data)
}

// 用户添加好友
export function addFriend(data) {
    return http.post("/api/addFriend", data)
}

// 处理好友申请
export function isAgree(data) {
    return http.post("/api/isAgree", data)
}

// 删除好友
export function delFriend(data) {
    return http.post("/api/delFriend", data)
}

// 发送消息
export function sendMsg(data) {
    return http.post("/api/sendMsg", data)
}

// 获取消息列表
export function getMsgList(data) {
    return http.post("/api/getMsgList", data)
}

// 获取消息提示
export function msgPrompt(data) {
    return http.post("/api/msgPrompt", data)
}

// 消息已读操作
export function read(data) {
    return http.post("/api/read", data)
}