var express = require('express');
var router = express.Router();

// 引入工具包
const { query } = require("../utils/db")
const { Msg } = require("../utils/error")
// 引入洗牌随机工具包
const { shuffer } = require("../utils/index")

// 添加详情
router.post('/adddetails', async function (req, res, next) {
    let { mov_name, details } = req.body // 获取前端传入数据
    if (mov_name == "" || details == "") {
        res.send(Msg({
            msg: "这两项都必须要填写"
        }))
        return
    }
    console.log(req.body, "这是前端传入的数据");

    // let sqlStr = `SELECT * FROM mov_info WHERE name LIKE '%${mov_name}%'` // 搜索时用到模糊查询

    let sqlStr = `SELECT * FROM mov_info WHERE name = "${mov_name}"`
    let [error, result] = await query(sqlStr) // 数据库中的结果
    // console.log(result, "这是数据库请求的结果");
    // console.log(error, "errorrrrrrrrr");
    if (error != null) {
        next({
            msg: "添加出了点问题，请修改后再试一次1" // 报错的话则提示写入失败，并给出结果
        })
        return
    }

    if (result.length == 0) {
        res.send(Msg({
            msg: "影视名错误，请检查后输入"
        }))
        return
    }

    // 取出其中的影视剧的mid,为稍后添加到另一张表使用
    var mid = result[0].mid
    // console.log(mid, "mid");

    let insertSql = `INSERT INTO mov_details(mid,details) VALUES ('${mid}','${details}')`
    let [insertError, insertResult] = await query(insertSql) // 数据库中的结果
    console.log(insertError, "插入错误");
    if (!insertError) {

        let selectSql = `SELECT * FROM mov_details WHERE mid = "${mid}"`
        let [selectError, selectResult] = await query(selectSql) // 数据库中的结果
        if (selectError != null) {
            next({
                msg: "添加出了点问题，请修改后再试一次2" // 报错的话则提示写入失败，并给出结果
            })
            return
        }
        // console.log(selectResult, "这是返回查询的结果");

        res.send(Msg({
            msg: "添加成功",
            code: 200,
            result: selectResult // 如果数据库不报错，即数据库写入成功，并将此次添加的内容作为数据返回给前端
        }))
    } else {
        next({
            msg: "添加出了点问题，请修改后再试一次3" // 报错的话则提示写入失败，并给出结果
        })
    }
});

// 获取详情
router.get("/getdetails", async function (req, res, next) {
    let { mid } = req.query

    if (mid == null) {
        res.send(Msg({
            msg: "缺少必要数据mid"
        }))
        return
    }
    // console.log(mid, "mid");

    let selectSql = `SELECT * FROM mov_info WHERE mid = "${mid}"`
    let [selectError, selectResult] = await query(selectSql) // 数据库中的结果
    if (!selectError) {

        // 对数据进行二次处理
        // console.log(selectResult[0].artist, "请求的演员");
        let list = selectResult[0].artist.split(",") // 将获取到的演员化为数组

        // console.log("开始打印1===========");

        let artist = [] // 创建一个数组保存演员信息
        list.map(async (item) => {
            let itemSql = `SELECT * FROM mov_art WHERE a_name = "${item}"`
            let promise = query(itemSql) // 得到单个的异步数据
            artist.push(promise) // 将得到的异步对象保存在数组中
        })
        // 得到数据
        let artists = await Promise.all(artist)
        artists = artists.map(item => {
            return {
                name: item[1][0].a_name,
                icon: item[1][0].a_icon
            }
        })

        let details = null
        let detailsSql = `SELECT * FROM mov_details WHERE mid = "${mid}"`
        let [detailsErr, detailsRes] = await query(detailsSql)
        if (!detailsErr) {
            // console.log(detailsRes, "结果----------------");
            details = detailsRes[0].details
        }

        // 对时间进行处理
        let year = new Date(parseInt(selectResult[0].on_time)).getFullYear(); // 转时间戳
        let month = new Date(parseInt(selectResult[0].on_time)).getMonth() + 1;
        let date = new Date(parseInt(selectResult[0].on_time)).getDate();
        let on_time = year + "-" + month + "-" + date;

        // 对编剧信息进行处理
        let bianju = selectResult[0].bianju.split(",")

        // 对导演信息进行处理
        let director = null;
        let directorSql = `SELECT * FROM mov_dir WHERE d_name = "${selectResult[0].director}"`
        let [dirErr, dirRes] = await query(directorSql)
        if (!dirErr) {
            director = {
                d_name: dirRes[0].d_name,
                d_icon: dirRes[0].d_icon
            }
            // console.log(dirRes[0].d_icon, "结果。。。。。。。。。。");
        }

        // 对分类进行处理
        let sort = selectResult[0].sort.split(",")

        // 创建一个数组封装返回数据
        let result = {
            id: selectResult[0].id,
            mid: selectResult[0].mid,
            name: selectResult[0].name,
            on_time,
            sort,
            cover: selectResult[0].cover,
            details,
            director,
            bianju,
            artists,
        }

        res.send(Msg({
            msg: "请求成功",
            code: 200,
            result
        }))
    } else {
        res.send(Msg({
            msg: "请求错误"
        }))
        return
    }

})

module.exports = router;
