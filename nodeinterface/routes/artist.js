var express = require('express');
var router = express.Router();

// 引入工具包
const { query } = require("../utils/db")
const { Msg } = require("../utils/error")

// 查询演员字段接口
router.get('/getartist', async function (req, res, next) {

    let sqlStr = `SELECT * FROM mov_info`
    let [error, results] = await query(sqlStr) // 数据库中的结果
    console.log(results, "这是数据库请求的结果");

    // 对数据库的结果进行二次处理并返回给前端
    let result = []
    results.map(item => {

        item.artist = item.artist.split(",")
        // console.log(item.artist, "这是二次封装的每一项");
        item.artist.map(item => {
            result.push(item)
        })
    })

    let result1 = new Set(result) // 去重
    result = Array.from(result1)

    result.map((item, index) => {
        let sqlStr2 = `INSERT INTO mov_art(a_id,a_name,a_icon) VALUES ("${index + 1}","${item}","/static/images/artist/${index + 1}.webp")`
        // console.log(item, "item");
        // console.log(index, "index");
        query(sqlStr2)
    })

    // let [error, results] = await query(sqlStr) // 数据库中的结果

    if (!error) {
        res.send(Msg({
            msg: "添加成功",
            code: 200,
            result: result // 如果数据库不报错，即数据库写入成功，并提示给前端本次注册结果
        }))
    } else {
        next({
            msg: "添加出了点问题，请修改后再试一次" // 报错的话则提示写入失败，并给出结果
        })
    }
});

// 查询导演列表接口
router.get('/getdirector', async function (req, res, next) {

    let sqlStr = `SELECT * FROM mov_info`
    let [error, results] = await query(sqlStr) // 数据库中的结果
    console.log(results, "这是数据库请求的结果");

    // 对数据库的结果进行二次处理并返回给前端
    let result = []
    results.map(item => {
        // console.log(item.artist, "这是二次封装的每一项");
        result.push(item.director)
    })

    let result1 = new Set(result) // 去重

    let result2 = [...result1]
    result = Array.from(result2)

    result.map((item, index) => {
        let sqlStr2 = `INSERT INTO mov_dir(d_id,d_name,d_icon) VALUES ("${index + 1}","${item}","/static/images/director/${index + 1}.jpeg")`
        // console.log(item, "item");
        // console.log(index, "index");
        query(sqlStr2)
    })

    // let [error, results] = await query(sqlStr) // 数据库中的结果

    if (!error) {
        res.send(Msg({
            msg: "添加成功",
            code: 200,
            result: result // 如果数据库不报错，即数据库写入成功，并提示给前端本次注册结果
        }))
    } else {
        next({
            msg: "添加出了点问题，请修改后再试一次" // 报错的话则提示写入失败，并给出结果
        })
    }
});

// 演员添加
router.post('/artistadd', async function (req, res, next) {
    console.log("进入了");
    let { a_id, a_name } = req.body
    console.log(a_id, a_name, "id和name");

    let sqlStr = `INSERT INTO mov_art(a_id,a_name,a_icon) VALUES ("${a_id}","${a_name}","/static/images/artist/${a_id}.jpeg")`
    let [error, results] = await query(sqlStr) // 数据库中的结果

    // 对数据库的结果进行二次处理并返回给前端
    if (!error) {
        res.send(Msg({
            msg: "添加成功",
            code: 200,
            results: null // 如果数据库不报错，即数据库写入成功，并提示给前端本次注册结果
        }))
    } else {
        next({
            msg: "添加出了点问题，请修改后再试一次" // 报错的话则提示写入失败，并给出结果
        })
    }
});



module.exports = router;
