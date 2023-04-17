var express = require('express');
const svgCaptcha = require("svg-captcha");
const md5 = require('md5')
const { v4: uuidv4 } = require('uuid')

var router = express.Router();

// 引入工具包
const { query } = require("../utils/db")
const { Msg } = require("../utils/error");
const { setToken, verifyToken } = require("../utils/token")
const app = require('../app');

// 获取个人评论
router.get("/getMyCom", async (req, res, next) => {
    let { sid, size } = req.query
    console.log(!sid, "sid");
    console.log(size, "size");

    if (!sid) {
        next({
            msg: "缺少参数"
        })
        return
    }
    let sqlShortStr
    let sqlLongStr
    if (size == "all") {
        sqlShortStr = `SELECT com.id,com.com_id,com.mid,com.content,com.com_time,com.heat,com.sid,com.short,com.is_comid,info.name FROM mov_com AS com LEFT JOIN mov_info as info on com.mid = info.mid WHERE sid = '${sid}' AND short = 1`
        sqlLongStr = `SELECT com.id,com.com_id,com.mid,com.content,com.com_time,com.heat,com.sid,com.short,com.is_comid,info.name  FROM mov_com AS com LEFT JOIN mov_info as info on com.mid = info.mid WHERE sid = '${sid}' AND short = 2`
    } else {
        sqlShortStr = `SELECT com.id,com.com_id,com.mid,com.content,com.com_time,com.heat,com.sid,com.short,com.is_comid,info.name  FROM mov_com AS com LEFT JOIN mov_info as info on com.mid = info.mid WHERE sid = '${sid}' AND short = 1 LIMIT 3`
        sqlLongStr = `SELECT com.id,com.com_id,com.mid,com.content,com.com_time,com.heat,com.sid,com.short,com.is_comid,info.name  FROM mov_com AS com LEFT JOIN mov_info as info on com.mid = info.mid WHERE sid = '${sid}' AND short = 2 LIMIT 3`
    }

    console.log(sqlShortStr);



    let [shortErr, shortRes] = await query(sqlShortStr)
    let [longErr, longRes] = await query(sqlLongStr)

    if (!shortErr || !longErr) {

        // 对数据进行二次处理
        shortRes.map(item => {
            item.com_time = new Date(parseInt(item.com_time)).getFullYear() + "-" + (new Date(parseInt(item.com_time)).getMonth() + 1) + "-" + new Date(parseInt(item.com_time)).getDate() + " " + new Date(parseInt(item.com_time)).getHours() + ":" + new Date(parseInt(item.com_time)).getMinutes()
        })

        longRes.map(item => {
            item.com_time = new Date(parseInt(item.com_time)).getFullYear() + "-" + (new Date(parseInt(item.com_time)).getMonth() + 1) + "-" + new Date(parseInt(item.com_time)).getDate() + " " + new Date(parseInt(item.com_time)).getHours() + ":" + new Date(parseInt(item.com_time)).getMinutes()
        })

        res.send(Msg({
            msg: "请求成功",
            code: 200,
            result: {
                short: shortRes,
                long: longRes
            }
        }))
    }

})

// 获取个人收藏
router.post("/getMyCollects", async (req, res, next) => {
    let { sid } = req.body
    if (!sid) {
        next({
            msg: "缺少必要参数 sid"
        })
        return
    }
    let selStr = `SELECT collects FROM member WHERE sid="${sid}"`
    let [selErr, selRes] = await query(selStr)
    if (!selErr) {
        // console.log(selRes[0].collects.split(",")[0], "selRes");
        if (selRes[0].collects.split(",")[0] == "") {
            res.send({
                msg: "请求成功",
                code: 200,
                result: []
            })
            return
        }
        let arr = []
        selRes[0].collects.split(",").map(item => {
            let selStr2 = `SELECT mid,name,mini_icon FROM mov_info WHERE mid="${item}"`
            let promise = query(selStr2)
            arr.push(promise)
        })
        let arr2 = await Promise.all(arr)
        results = arr2.map(item => {
            return {
                mid: item[1][0].mid,
                name: item[1][0].name,
                mini_icon: item[1][0].mini_icon
            }
        })

        res.send({
            msg: "请求成功",
            code: 200,
            result: results
        })
    }

})

module.exports = router;
