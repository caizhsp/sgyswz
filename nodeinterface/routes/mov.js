var express = require('express');
var router = express.Router();

const formidable = require("formidable")
const path = require("path")


// 引入工具包
const { query } = require("../utils/db")
const { Msg } = require("../utils/error")
const { rank, deepCopy } = require("../utils")

// top榜
router.get("/top", async (req, res, next) => {
  let { sort = "desc" } = req.query
  /*
    sort:选填，排序规则
  */
  let selectAllSql = `SELECT * FROM mov_info`
  let [selectAllErr, selectAllRes] = await query(selectAllSql)
  if (!selectAllErr) {
    selectAllRes = rank(selectAllRes, "top", sort)
    // 对查询到的数据进行二次封装
    let bannerList = deepCopy(selectAllRes).splice(0, 3)

    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result: {
        bannerList,
        list: selectAllRes
      }
    }))
  } else {
    next(Msg({
      msg: "请求失败，请检查代码"
    }))
  }
})

// 热榜
router.get("/hot", async (req, res, next) => {
  let { sort = "desc" } = req.query
  /*
    sort:选填，排序规则
  */
  let selectAllSql = `SELECT * FROM mov_info`
  let [selectAllErr, selectAllRes] = await query(selectAllSql)
  if (!selectAllErr) {
    selectAllRes = rank(selectAllRes, "hot", sort)
    // 对查询到的数据进行二次封装
    let bannerList = deepCopy(selectAllRes).splice(0, 3)

    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result: {
        bannerList,
        list: selectAllRes
      }
    }))
  } else {
    next(Msg({
      msg: "请求失败，请检查代码"
    }))
  }
})

// 新榜
router.get("/new", async (req, res, next) => {
  let { sort = "desc" } = req.query
  /*
    sort:选填，排序规则
  */
  let selectAllSql = `SELECT * FROM mov_info`
  let [selectAllErr, selectAllRes] = await query(selectAllSql)
  if (!selectAllErr) {
    selectAllRes = rank(selectAllRes, "on_time", sort)
    // 对查询到的数据进行二次封装
    let bannerList = deepCopy(selectAllRes).splice(0, 3)

    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result: {
        bannerList,
        list: selectAllRes
      }
    }))
  } else {
    next(Msg({
      msg: "请求失败，请检查代码"
    }))
  }
})

// 推荐榜
router.get("/commend", async (req, res, next) => {
  let { sort = "desc" } = req.query
  /*
    sort:选填，排序规则
  */
  let selectAllSql = `SELECT * FROM mov_info`
  let [selectAllErr, selectAllRes] = await query(selectAllSql)
  if (!selectAllErr) {
    // 对查询到的数据进行二次封装
    let bannerList = deepCopy(selectAllRes).splice(0, 3)

    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result: {
        bannerList,
        list: selectAllRes
      }
    }))
  } else {
    next(Msg({
      msg: "请求失败，请检查代码"
    }))
  }
})

// 获取电影列表接口（用于前端搜索）
router.get("/getmovlist", async function (req, res, next) {
  let selectStr = `SELECT * FROM mov_info`
  let [selErr, selRes] = await query(selectStr)
  if (!selErr) {

    // 对获取到的结果进行二次封装
    let result = selRes.map(item => {
      return {
        mid: item.mid,
        value: item.name
      }
    })

    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result
    }))
  }
})

// 搜索电影接口
router.get("/movsearch", async function (req, res, next) {
  let { keyword } = req.query // 接收前端搜索关键词
  let sqlStr = `SELECT * FROM mov_info WHERE name LIKE '%${keyword}%'`
  let [seaErr, seaRes] = await query(sqlStr)
  if (!seaErr) {

    // 对数据进行二次处理
    seaRes.map(item => {
      item.on_time = new Date(parseInt(item.on_time)).getFullYear() + "-" + (new Date(parseInt(item.on_time)).getMonth() + 1) + "-" + new Date(parseInt(item.on_time)).getDate()
      item.artist = item.artist.split(",")
    })

    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result: seaRes
    }))
  } else {
    next({
      msg: "请求错误，请稍后重试"
    })
  }
})


// 添加电影接口
router.post('/addmov', async function (req, res, next) {
  console.log(req.body, "前端发送的");
  var { mid, hot, name, ontime, artist, bianju, director, sort, cover, miniicon } = req.body
  let insertStr = `INSERT INTO mov_info(mid,name,on_time,artist,bianju,director,sort,hot,cover,mini_icon) VALUES ("${mid}","${name}","${ontime}","${artist}","${bianju}","${director}","${sort}","${hot}","${cover}","${miniicon}")`

  let [insertErr, insertRes] = await query(insertStr)
  if (!insertErr) {
    res.send(Msg({
      msg: "添加成功",
      code: 200,
      result: null // 如果数据库不报错，即数据库写入成功，并提示给前端本次注册结果
    }))
  } else {
    next({
      msg: "添加出了点问题，请修改后再试一次" // 报错的话则提示写入失败，并给出结果
    })
  }
});

// 获取影片分类信息
router.get("/getsort", async function (req, res, next) {
  let sortSql = `SELECT * FROM mov_info`
  let [sortErr, sortRes] = await query(sortSql)
  if (!sortErr) {
    // 对查询到的数据进行二次处理，只获取分类信息
    let sortArr = []
    sortRes.map(item => {
      item.sort = item.sort.split(",")
      item.sort.map(item => {
        sortArr.push(item)
      })
    })

    let result1 = new Set(sortArr) // 去重
    let result2 = [...result1]

    let result3 = ["comedy", "love", "drama", "science", "animation", "story", "cliffhang", "costume", "war", "action"]
    let result = result2.map((item, index) => {
      return {
        nickname: result3[index],
        name: item
      }
    })

    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result
    }))
  } else {
    next({
      msg: "请求失败"
    })
  }

})

// 影视分类
router.get("/sort", async function (req, res, next) {
  let { sort } = req.query

  // 判断是否有必传参数
  if (!sort) {
    next({
      msg: "缺少必要条件：分类"
    })
  } else {
    let sortSql = `SELECT * FROM mov_info WHERE sort LIKE '%${sort}%'`
    let [sortErr, sortRes] = await query(sortSql)
    // 对数据进行二次处理
    sortRes.map(item => {
      item.on_time = new Date(parseInt(item.on_time)).getFullYear() + "-" + (new Date(parseInt(item.on_time)).getMonth() + 1) + "-" + new Date(parseInt(item.on_time)).getDate()
      item.artist = item.artist.split(",")
    })

    if (!sortErr) {
      res.send(Msg({
        msg: "请求成功",
        code: 200,
        result: sortRes
      }))
    }
  }
})

// 影视收藏
router.post("/movcollect", async (req, res, next) => {
  /**
   * 判断是否有此影片，有的话则移出，没有的话则添加
   */
  let { sid, mid } = req.body
  if (!sid || !mid) {
    next({
      msg: "缺少必要参数"
    })
    return
  }
  let infoStr = `SELECT * FROM member WHERE sid="${sid}"`
  let [infoErr, infoRes] = await query(infoStr)
  if (!infoErr) {
    var arr;
    var flag;
    if (infoRes[0].collects == "") {
      console.log("无数据，准备[]");
      flag = false
      arr = []
    } else {
      console.log("有数据，准备分割");
      arr = infoRes[0].collects.split(",") // 转数组
      flag = arr.some(item => {
        return item == mid
      })
    }

    if (!flag) {
      arr.push(mid)
      let arr2 = arr.toString()
      let updateStr = `UPDATE member SET collects="${arr2}" WHERE sid="${sid}"`
      let [updateErr, updateRes] = await query(updateStr)
      if (!updateErr) {
        let selStr = `SELECT * FROM member WHERE sid="${sid}"`
        let [selErr, selRes] = await query(selStr)
        if (!selErr) {
          selRes[0].collects = selRes[0].collects.split(",")
          // 获取好友列表，返回前端进行拼接
          let selFriendStr = `SELECT * FROM m_friedns WHERE sid="${sid}"`
          let [selFriendErr, selFriendRes] = await query(selFriendStr)
          if (!selFriendErr) {
            var friedList = [];
            if (selFriendRes.length == 0) {
              friedList = []
            } else {
              let arr = []
              selFriendRes[0].f_sid.split(",").map(item => {
                let sStr = `SELECT sid,nickname,icon FROM member WHERE sid = '${item}'`
                arr.push(query(sStr))
              })
              let data = await Promise.all(arr)
              let data2 = data.map(item => {
                return item[1][0]
              })
              // 查询每个sid对应的信息，并打包返回
              selRes[0].friends = data2
            }


            // 查询是否有好友请求，返回前端进行拼接
            let selAddStr = `SELECT * FROM m_add WHERE  f_sid ="${sid}"`
            let [selAddErr, selAddRes] = await query(selAddStr)
            if (!selAddErr) {
              if (selAddRes.length >= 1) {
                let arr = []
                selAddRes.map(item => {
                  let selADDStr2 = `SELECT sid,nickname,sex,icon FROM member WHERE sid = '${item.sid}'`
                  arr.push(query(selADDStr2))
                })
                let arr2 = await Promise.all(arr)
                let r = arr2.map(item => {
                  return item[1][0]
                })
                selRes[0].addMsg = r
              } else {
                selRes[0].addMsg = []
              }
            }

            res.send(Msg({
              msg: "收藏成功",
              code: 200,
              result: selRes[0]
            }))
          }
        }
      }
    } else {
      let i = arr.indexOf(mid)
      arr.splice(i, 1)
      let arr2 = arr.toString()
      let updateStr = `UPDATE member SET collects="${arr2}" WHERE sid="${sid}"`
      let [updateErr, updateRes] = await query(updateStr)
      if (!updateErr) {
        let selStr = `SELECT * FROM member WHERE sid="${sid}"`
        let [selErr, selRes] = await query(selStr)
        if (!selErr) {
          selRes[0].collects = selRes[0].collects.split(",")

          // 获取好友列表，返回前端进行拼接
          let selFriendStr = `SELECT * FROM m_friedns WHERE sid="${sid}"`
          let [selFriendErr, selFriendRes] = await query(selFriendStr)
          if (!selFriendErr) {
            var friedList = [];
            if (selFriendRes.length == 0) {
              friedList = []
            } else {
              let arr = []
              selFriendRes[0].f_sid.split(",").map(item => {
                let sStr = `SELECT sid,nickname,icon FROM member WHERE sid = '${item}'`
                arr.push(query(sStr))
              })
              let data = await Promise.all(arr)
              let data2 = data.map(item => {
                return item[1][0]
              })
              // 查询每个sid对应的信息，并打包返回
              selRes[0].friends = data2
            }


            // 查询是否有好友请求，返回前端进行拼接
            let selAddStr = `SELECT * FROM m_add WHERE  f_sid ="${sid}"`
            let [selAddErr, selAddRes] = await query(selAddStr)
            if (!selAddErr) {
              if (selAddRes.length >= 1) {
                let arr = []
                selAddRes.map(item => {
                  let selADDStr2 = `SELECT sid,nickname,sex,icon FROM member WHERE sid = '${item.sid}'`
                  arr.push(query(selADDStr2))
                })
                let arr2 = await Promise.all(arr)
                let r = arr2.map(item => {
                  return item[1][0]
                })
                selRes[0].addMsg = r
              } else {
                selRes[0].addMsg = []
              }
            }

            res.send(Msg({
              msg: "取消收藏成功",
              code: 200,
              result: selRes[0]
            }))
          }
        }
      }
    }
  }

})



module.exports = router;
