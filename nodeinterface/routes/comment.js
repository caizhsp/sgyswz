var express = require('express');
var router = express.Router();

const formidable = require("formidable")
const path = require("path")
const { v4: uuidv4 } = require('uuid');
const shortid = require('shortid');
const short = require('short-uuid');


// 引入工具包
const { query } = require("../utils/db")
const { Msg } = require("../utils/error")
const { rank, deepCopy } = require("../utils")

// 发表评论接口
router.post("/commentadd", async (req, res, next) => {
    /**
     *  id:自增
     *  com_id:评论id，随机生成
     *  mid:隶属于哪个影片
     *  content:评论内容
     *  com_time:评论时间
     *  heat:默认热度，为0
     *  sid:发表评论人
     *  short:是否为短评，1为是 2为否
     *  is_comid:隶属于哪个评论，顶级评论为0，二级评论为一级评论的id（不是com_id）
     */
    let { mid, content, con_text, sid } = req.body
    console.log(mid, content, con_text, sid);
    if (mid == undefined || content == undefined || sid == undefined) {
        next({
            msg: "参数丢失，添加错误"
        })
        return
    }

    let com_id = short.generate() // com_id
    // 判断是否属于短评
    let isShort = 1
    if (con_text.split("").length > 50) {
        isShort = 2
    }
    let createtime = new Date().getTime() // 当前时间的时间戳
    console.log(createtime, "创建时间");
    let heat = 0
    let is_comid = 0
    let insertSql = `INSERT INTO mov_com(com_id,mid,content,com_time,heat,sid,short,is_comid) VALUES ("${com_id}","${mid}","${content}","${createtime}","${heat}","${sid}","${isShort}","${is_comid}")`
    let [insertErr, insertRes] = await query(insertSql)
    if (!insertErr) {
        res.send(Msg({
            msg: "发布成功",
            code: 200,
            result: null
        }))
    }

})

// 获取短评接口
router.get("/commentshort", async (req, res, next) => {
    let { mid, page = 1, size = 4, rank, all = false } = req.query
    console.log(all, "all");
    let shortSql;
    if (!rank) {
        shortSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "1" ORDER BY mov_com.id DESC  LIMIT ${(page - 1) * size},${size}`
    } else if (rank == "hot") {
        // let longSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "2" LIMIT ${(page - 1) * size},${size}`
        shortSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "1" ORDER BY mov_com.heat DESC LIMIT ${(page - 1) * size},${size}`
    } else if (rank == "new") {
        shortSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "1" ORDER BY mov_com.com_time+0 DESC LIMIT ${(page - 1) * size},${size}`
    } else if (rank == "friend") {
        // 先暂定和时间排序一样
        shortSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "1" ORDER BY mov_com.com_time DESC LIMIT ${(page - 1) * size},${size}`
    }

    if (all) {
        shortSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "1"`
    }

    // shortSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "1" LIMIT ${(page - 1) * size},${size}`

    let short = [];

    let [shortErr, shortRes] = await query(shortSql)
    if (!shortErr) {
        short = shortRes
    }

    // 对获取到的数据进行二次处理
    short.map(item => {
        item.com_time = new Date(parseInt(item.com_time)).getFullYear() + "-" + (new Date(parseInt(item.com_time)).getMonth() + 1) + "-" + new Date(parseInt(item.com_time)).getDate() + " " + new Date(parseInt(item.com_time)).getHours() + ":" + new Date(parseInt(item.com_time)).getMinutes() + ":" + new Date(parseInt(item.com_time)).getSeconds()
    })

    res.send(Msg({
        msg: "请求成功",
        code: 200,
        result: {
            mid,
            short
        }
    }))
})

// 获取长评接口
router.get("/commentlong", async (req, res, next) => {
    let { mid, page = 1, size = 4, rank, all = false } = req.query
    console.log(mid, page, size);
    let longSql;
    if (!rank) {
        longSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "2" ORDER BY mov_com.id DESC  LIMIT ${(page - 1) * size},${size}`
    } else if (rank == "hot") {
        // let longSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "2" LIMIT ${(page - 1) * size},${size}`
        longSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "2" ORDER BY mov_com.heat DESC LIMIT ${(page - 1) * size},${size}`
    } else if (rank == "new") {
        longSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "2" ORDER BY mov_com.com_time+0 DESC LIMIT ${(page - 1) * size},${size}`
    } else if (rank == "friend") {
        // 先暂定和时间排序一样
        longSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "2" ORDER BY mov_com.com_time DESC LIMIT ${(page - 1) * size},${size}`
    }

    if (all) {
        longSql = `SELECT * FROM mov_com RIGHT JOIN member ON mov_com.sid = member.sid WHERE mov_com.mid = "${mid}" AND mov_com.short = "2"`
    }

    let long = [];
    let [longErr, longRes] = await query(longSql)
    if (!longErr) {
        long = longRes
    }

    // 对获取到的数据进行二次处理
    long.map(item => {
        item.com_time = new Date(parseInt(item.com_time)).getFullYear() + "-" + (new Date(parseInt(item.com_time)).getMonth() + 1) + "-" + new Date(parseInt(item.com_time)).getDate() + " " + new Date(parseInt(item.com_time)).getHours() + ":" + new Date(parseInt(item.com_time)).getMinutes() + ":" + new Date(parseInt(item.com_time)).getSeconds()
    })
    res.send(Msg({
        msg: "请求成功",
        code: 200,
        result: {
            mid,
            long
        }
    }))
})

// 获取评论总数
router.get("/commentCount", async (req, res, next) => {
    let { mid } = req.query
    let shortSql = `SELECT * FROM mov_com WHERE mid="${mid}" AND short="1"`
    let longSql = `SELECT * FROM mov_com WHERE mid="${mid}" AND short="2"`

    let [shortErr, shortRes] = await query(shortSql)
    let [longErr, longRes] = await query(longSql)

    if (!shortErr || !longErr) {
        res.send(Msg({
            msg: "请求成功",
            code: 200,
            result: {
                shortCount: shortRes.length,
                longCount: longRes.length
            }
        }))
    }
})

// 评论删除
router.get("/comDel", async (req, res, next) => {
    let { com_id } = req.query
    if (!com_id) {
        next({
            msg: "操作失败"
        })
        return
    }
    let delStr = `DELETE FROM mov_com WHERE com_id = '${com_id}'`
    let [delErr, delRes] = await query(delStr)
    if (!delErr) {
        res.send(Msg({
            msg: "删除成功",
            code: 200,
            result: null
        }))
    } else {
        next({
            msg: "删除失败"
        })
    }
})

module.exports = router;
