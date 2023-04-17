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

/* 注册接口 */
router.post('/register', async function (req, res, next) {
  // 获取前端传入的注册信息
  var { nickname, username, password, sex, code, remark } = req.body
  console.log(req.body);
  console.log(req.session.captcha, "这是验证码");
  // 判断验证码是否输入正确
  code = code.toUpperCase()
  req.session.captcha = req.session.captcha.toUpperCase()
  if (req.session.captcha != code) {
    res.send(Msg({
      msg: "验证码错误",
    }))
    return
  }

  // 查询用户注册的账号是否存在，如果存在则提示报错
  let checkUsernameSql = `SELECT * FROM member WHERE username = "${username}"`
  let [error, results] = await query(checkUsernameSql)
  console.log(results.length, "这是长度");
  if (results.length > 0) {
    next({
      msg: "用户名已存在，请重新输入"
    })
    return
  }

  // 无误之后写入数据库

  // 如果账号和验证码都正确，则生成一个专属sid、获取当前时间的时间戳，并将密码加密，写入到数据库中
  let sid = uuidv4()
  let createDate = Date.now()
  let pwdMd5 = md5(password)

  let insertStr = `INSERT INTO member(sid,nickname,username,password,createtime,sex,remark,icon,area,collects,birthday) VALUES ("${sid}","${nickname}","${username}","${pwdMd5}","${createDate}","${sex}","${remark}","/static/images/icon/1.jpeg","河南省/郑州市/新郑市","","")`

  let [insertErr, insertRes] = await query(insertStr)
  if (!insertErr) {
    res.send(Msg({
      msg: "注册成功",
      code: 200,
      result: null // 如果数据库不报错，即数据库写入成功，并提示给前端本次注册结果
    }))
  } else {
    next({
      msg: "注册出了点问题，请修改后再试一次" // 报错的话则提示写入失败，并给出结果
    })
  }

});

// 登录接口
router.post("/login", async function (req, res, next) {
  let { username, password } = req.body // 获取到用户登录的账号、密码、验证码
  let pwdMd5 = md5(password) // 加密密码，为了方便与数据库中保存的密码进行对比

  // 查询登录用户账号所对应的密码
  let sqlStr = `SELECT * FROM member WHERE username = "${username}"`
  let [error, results] = await query(sqlStr)
  if (results.length > 0) { // 如果查询存在，则results中长度 > 0
    if (results[0].username == username && results[0].password == pwdMd5) { // 对比账号和密码
      let data = {
        sid: results[0].sid // 将sid封装为对象，传入setToken
      }
      let token = setToken(data) // 将data封装为token返回给前端，作为后续访问带权限页面的标识
      results[0].token = token
      // 处理时间格式
      results[0].createtime = new Date(parseInt(results[0].createtime)).getFullYear() + "-" + (new Date(parseInt(results[0].createtime)).getMonth() + 1) + "-" + new Date(parseInt(results[0].createtime)).getDate()
      // 处理收藏格式
      results[0].collects = results[0].collects.split(",")

      // 查询是否有好友请求
      let selStr = `SELECT * FROM m_add WHERE  f_sid ="${results[0].sid}"`
      console.log(results[0].sid, "---------------------sid");
      let [selErr, selRes] = await query(selStr)
      if (!selErr) {
        // 有则查询请求人sid，无则正常返回为null
        if (selRes.length >= 1) {
          console.log(selRes, "selRes[0]");
          let arr = []
          selRes.map(item => {
            let selStr2 = `SELECT sid,nickname,sex,icon FROM member WHERE sid = '${item.sid}'`
            arr.push(query(selStr2))
          })
          let arr2 = await Promise.all(arr)
          let r = arr2.map(item => {
            return item[1][0]
          })
          results[0].addMsg = r
        } else {
          results[0].addMsg = []
          console.log(results[0].addMsg, "results[0].addMsg");
        }

        // 从数据库中获取好友列表
        let fStr = `SELECT f_sid FROM m_friedns WHERE sid = "${results[0].sid}"`
        let [fErr, fRes] = await query(fStr)
        if (!fErr) {
          console.log(fRes, "fRes===================================================");
          // 查询无误则将结果转换为数组添加到对象上
          if (fRes.length == 0) { // 为0说明无数据(无任何好友关系)

            results[0].friends = []
          } else {
            let arr = []
            fRes[0].f_sid.split(",").map(item => {
              let sStr = `SELECT sid,nickname,icon FROM member WHERE sid = '${item}'`
              arr.push(query(sStr))
            })
            let data = await Promise.all(arr)
            let data2 = data.map(item => {
              return item[1][0]
            })
            // 查询每个sid对应的信息，并打包返回
            results[0].friends = data2
          }
        } else {
          // 查询错误则返回一个空数组(为了避免报错)
          results[0].friends = []
        }

        res.send(Msg({
          msg: "登录成功",
          code: 200,
          result: results[0]
        }))
      }
    } else {
      next({
        msg: "账号与密码不匹配"
      })
      return
    }
  } else {
    next({
      msg: "账号不存在，请先创建"
    })
  }
})

// 验证码接口
router.get('/captcha', (req, res, next) => {
  var captcha = svgCaptcha.create({
    ignoreChars: '0OoLlIi' // 忽略关键字
  });
  req.session.captcha = captcha.text; // 将验证码的文本信息保存在cookie.session中

  res.type('svg');

  console.log(captcha.text);
  res.status(200).send(captcha.data);
})

// 编辑用户资料
router.post("/edit", async (req, res, next) => {
  let { nickname, sex, birthday, area, sid } = req.body
  if (!nickname || !sex || !birthday || !area || !sid) {
    next({
      msg: "请求失败,缺少必传字段"
    })
  }
  // 将编辑的信息更新到数据库中
  let editStr = `UPDATE member SET nickname="${nickname}",sex="${sex}",area="${area}",birthday="${birthday}" WHERE sid="${sid}"`
  let [editErr, editRes] = await query(editStr)
  if (!editErr) {
    // 查询更改后的数据，并返回
    let selectStr = `SELECT * FROM member WHERE sid="${sid}"`
    let [selErr, selRes] = await query(selectStr)
    if (!selErr) {

      // 将数据中的收藏改为数组
      selRes[0].collects = selRes[0].collects.split(",")

      // 查询是否有好友请求
      let selStr2 = `SELECT * FROM m_add WHERE  f_sid ="${selRes[0].sid}"`
      let [selErr2, selRes2] = await query(selStr2)
      if (!selErr2) {
        // 有则查询请求人sid，无则正常返回为null
        if (selRes2.length >= 1) {
          let arr = []
          selRes.map(item => {
            let selStr3 = `SELECT sid,nickname,sex,icon FROM member WHERE sid = '${item.sid}'`
            arr.push(query(selStr3))
          })
          let arr2 = await Promise.all(arr)
          let r = arr2.map(item => {
            return item[1][0]
          })
          selRes[0].addMsg = r
        } else {
          selRes[0].addMsg = []
        }

        // 从数据库中获取好友列表
        let fStr = `SELECT f_sid FROM m_friedns WHERE sid = "${selRes[0].sid}"`
        let [fErr, fRes] = await query(fStr)
        if (!fErr) {
          // 查询无误则将结果转换为数组添加到对象上
          if (fRes.length == 0) {
            selRes[0].friends = []
          } else {
            let arr = []
            fRes[0].f_sid.split(",").map(item => {
              let sStr = `SELECT sid,nickname,icon FROM member WHERE sid = '${item}'`
              arr.push(query(sStr))
            })
            let data = await Promise.all(arr)
            let data2 = data.map(item => {
              return item[1][0]
            })
            selRes[0].friends = data2
          }

          // console.log( fRes[0]," fRes[0]");
        } else {
          // 查询错误则返回一个空数组(为了避免报错)
          selRes[0].friends = []
        }

        res.send(Msg({
          msg: "请求成功",
          code: 200,
          result: selRes[0]
        }))
      } else {
        next({
          msg: "请求失败"
        })
      }
    }
  } else {
    next({
      msg: "修改失败"
    })
  }
})

// 获取用户资料
router.post("/getUserInfo", async (req, res, next) => {
  console.log("进入了获取资料接口");
  let { sid } = req.body
  if (!sid) {
    next({
      msg: "缺少必传入参数sid"
    })
    return
  }
  let sqlStr = `SELECT sid,nickname,createtime,sex,remark,icon,area,collects FROM member WHERE sid="${sid}"`
  let [sqlErr, sqlRes] = await query(sqlStr)

  if (!sqlErr) {
    console.log(sqlRes, "用户资料");
    // 获取用户的好友列表
    let fStr = `SELECT f_sid FROM m_friedns WHERE sid = "${sid}"`
    let [fErr, fRes] = await query(fStr)
    if (!fErr) {
      console.log(fRes, "数据长度-------------------");
      // 查询无误则将结果转换为数组添加到对象上
      if (fRes.length == 0) { // 为0说明无数据(无任何好友关系)
        sqlRes[0].friends = []
      } else {
        let arr = []
        fRes[0].f_sid.split(",").map(item => {
          let sStr = `SELECT sid,nickname,icon FROM member WHERE sid = '${item}'`
          arr.push(query(sStr))
        })
        let data = await Promise.all(arr)

        let data2 = data.map(item => {
          return item[1][0]
        })

        // 查询每个sid对应的信息，并打包返回
        sqlRes[0].friends = data2
      }
    }

    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result: sqlRes[0]
    }))
  } else {
    next({
      msg: "用户资料接口请求错误"
    })
  }
})

// 用户加好友
router.post("/addFriend", async (req, res, next) => {
  console.log("进入了");
  let { sid, f_sid } = req.body
  if (!sid || !f_sid) {
    next({
      msg: "请检查必要参数sid或f_sid"
    })
  }
  // 添加之前查询是否有添加记录，如果有则提示重复添加
  let selStr = `SELECT * FROM m_add WHERE sid="${sid}" AND f_sid ="${f_sid}"`
  let [selErr, selRes] = await query(selStr)
  if (!selErr) {
    if (selRes.length >= 1) {
      next({
        msg: "你已提交过请求，请勿重复提交"
      })
      return
    }
  }

  let inStr = `INSERT INTO m_add(sid,f_sid) VALUES ("${sid}","${f_sid}")`
  let [inErr, inRes] = await query(inStr)
  if (!inErr) {
    res.send(Msg({
      msg: "请求成功",
      code: 200,
      result: null
    }))
  }
})

// 同意和拒绝好友请求
router.post("/isAgree", async (req, res, next) => {
  /**
   * sid:当前用户的sid
   * f_sid:申请人的sid
   */
  let { sid, f_sid, isAdd } = req.body
  if (!sid || !f_sid) {
    next({
      msg: "缺少必要参数sid或f_sid"
    })
    return
  }

  if (isAdd) {
    let flag1 = false;
    let flag2 = false;

    // 先查询有没有此用户的数据条，有则在原来的f_sid尾部追加，无则新建
    let selStr1 = `SELECT * FROM m_friedns WHERE sid="${sid}"`
    let [selErr1, selRes1] = await query(selStr1)
    if (!selErr1) {
      if (selRes1.length == 0) {
        let inStr = `INSERT INTO m_friedns(sid,f_sid) VALUES ("${sid}","${f_sid}")`
        let [inErr, inRes] = await query(inStr)
        if (!inErr) {
          flag1 = true
        }
      } else {
        let selStr3 = `SELECT * FROM m_friedns WHERE sid="${sid}"`
        let [selErr3, selRes3] = await query(selStr3)
        let arr = [];
        if (!selErr3) {
          if (selRes3[0].f_sid == "") {
            arr.push(f_sid)
          } else {
            arr = selRes3[0].f_sid.split(",")
            arr.push(f_sid)
          }
          console.log(arr, "已有基础上追加的");
          let upStr = `UPDATE m_friedns SET f_sid = "${arr.toString()}" WHERE sid="${sid}"`
          let [upErr, upRes] = await query(upStr)
          if (!upErr) {
            flag1 = true
          }
        }
      }
    }

    // 由于加好友是双向的，需要在对方的sid下存储本人的sid
    // 先查询有没有此用户的数据条，有则在原来的f_sid尾部追加，无则新建
    let selStr2 = `SELECT * FROM m_friedns WHERE sid="${f_sid}"`
    let [selErr2, selRes2] = await query(selStr2)
    if (!selErr2) {
      if (selRes2.length == 0) {
        let inStr2 = `INSERT INTO m_friedns(sid,f_sid) VALUES ("${f_sid}","${sid}")`
        let [inErr2, inRes2] = await query(inStr2)
        if (!inErr2) {
          flag2 = true
        }
      } else {
        let selStr4 = `SELECT * FROM m_friedns WHERE sid="${f_sid}"`
        let [selErr4, selRes4] = await query(selStr4)
        if (!selErr4) {
          let arr = []
          // 如果已有数据，但是为空字符串，说明曾经创建过，但是好友已被清除，此时需要做判断
          if (selRes4[0].f_sid == "") { // 为空串则直接push
            arr.push(sid)
          } else {
            arr = selRes4[0].f_sid.split(",") // 不为空说明有数据，则分割再pusg
            arr.push(sid)
          }
          let upStr2 = `UPDATE m_friedns SET f_sid = "${arr.toString()}" WHERE sid="${f_sid}"`
          let [upErr2, upRes2] = await query(upStr2)
          if (!upErr2) {
            flag2 = true
          }
        }
      }
    }
    // 如果两项操作都顺利完成，则返回成功，否则失败
    if (flag1 && flag2) {
      res.send(Msg({
        msg: "添加成功",
        code: 200,
        result: null
      }))
    } else {
      next({
        msg: "添加失败，请稍后重试"
      })
    }
    // 处理完申请就删除此条记录
    let delStr = `DELETE FROM m_add WHERE sid="${f_sid}" AND f_sid="${sid}"`
    await query(delStr)
  } else {
    console.log("enter");
    // 拒绝操作则直接删除此次好友申请记录
    let delStr = `DELETE FROM m_add WHERE sid="${f_sid}" AND f_sid="${sid}"`
    let [delErr, delRes] = await query(delStr)
    if (!delErr) {
      res.send(Msg({
        msg: "已拒绝",
        code: 200,
        result: null
      }))
      return
    } else {
      next({
        msg: "处理失败，请稍后重试"
      })
    }
  }
})

// 删除好友
router.post("/delFriend", async (req, res, next) => {
  let { sid, f_sid } = req.body
  /**
   * 1.根据sid查找出对应的f_sid
   * 2.对f_sid进行对比更新处理(删减)
   */
  let selStr = `SELECT f_sid FROM m_friedns WHERE sid = "${sid}"`
  let [selErr, selRes] = await query(selStr)
  if (!selErr) {
    let arr = selRes[0].f_sid.split(",")
    // 对f_sid字符串进行转换并对比删除,将删除好友sid返回
    let delFriend = arr.splice(arr.indexOf(f_sid), 1)
    // 将删除后的数据更新到数据库中
    let upStr = `UPDATE m_friedns SET f_sid = "${arr.toString()}" WHERE sid="${sid}"`
    let [upErr, upRes] = await query(upStr)
    if (!upErr) {
      res.send(Msg({
        msg: "删除成功",
        code: 200,
        result: delFriend
      }))
    } else {
      next({ msg: "操作失败了，请稍后再试吧" })
    }
  } else {
    next({
      msg: "操作失败，请稍后重试"
    })
  }
})

// 发消息
router.post("/sendMsg", async (req, res, next) => {
  let { sid, f_sid, content } = req.body
  if (!sid || !f_sid) {
    next({
      msg: "缺少必要数据sid或f_sid"
    })
    return
  }
  /**
   * id  聊天室id (数据库自生成)
   * c_id  聊天记录id(与时间保持一致，即可不重复，若考虑几率问题，则可拼接上sid或f_sid)
   * c_send  发送方sid
   * c_receive  接收方sid
   * c_content  消息内容
   * c_time  消息发送时间
   * re_status  读取人状态
   */


  let createtime = new Date().getTime() // 获取当前事件的时间戳

  // 判断表中是否有此二人的聊天消息记录，有的话，在聊天室id中追加，没有的话则新建
  let selIDStr1 = `SELECT c_id FROM m_chat WHERE c_send = "${sid}" AND c_receive = "${f_sid}"`
  let selIDStr2 = `SELECT c_id FROM m_chat WHERE c_send = "${f_sid}" AND c_receive = "${sid}"`
  let [selErr1, selRes1] = await query(selIDStr1)
  let [selErr2, selRes2] = await query(selIDStr2)
  if (!selErr1 && !selErr2) {
    var inStr;
    // 不存在聊天室(两人从未聊过天),直接新建聊天室并添加本条记录
    if (selRes1.length == 0 && selRes2.length == 0) {
      console.log("进入了第一个判断");
      inStr = `INSERT INTO m_chat(c_id,msg_id,c_send,c_receive,c_content,c_time,re_status) VALUE ("${createtime}","${createtime}","${sid}","${f_sid}","${content}","${createtime}","0")`
    } else if (selRes1.length > 0 && selRes1[0].c_id) { // 查找到两人有聊天室，且是由本人(sid)主动发起的
      console.log("进入了第二个判断");
      inStr = `INSERT INTO m_chat(c_id,msg_id,c_send,c_receive,c_content,c_time,re_status) VALUE ("${selRes1[0].c_id}","${createtime}","${sid}","${f_sid}","${content}","${createtime}","0")`
    } else if (selRes2.length > 0 && selRes2[0].c_id) { // 查找到两人有聊天室，且是由对方(f_sid)主动发起的
      console.log("进入了第三个判断");
      inStr = `INSERT INTO m_chat(c_id,msg_id,c_send,c_receive,c_content,c_time,re_status) VALUE ("${selRes2[0].c_id}","${createtime}","${sid}","${f_sid}","${content}","${createtime}","0")`
    }
  }
  console.log(selRes1, "selRes1");
  console.log(selRes2, "selRes2");
  console.log(inStr, "inStr");

  let [inErr, inRes] = await query(inStr)
  if (!inErr) {
    res.send(Msg({
      msg: "发送成功",
      code: 200,
      result: null
    }))
  } else {
    next({
      msg: "发送失败，请稍后重试"
    })
  }
})

// 获取消息列表
router.post("/getMsgList", async (req, res, next) => {
  console.log("进入了");
  let { sid, f_sid } = req.body
  if (!sid || !f_sid) {
    next({
      msg: "缺少必要参数sid或f_sid"
    })
    return
  }
  // 先通过sid和f_sid查询房间号，再通过房间号查询聊天记录
  let selCIDStr1 = `SELECT c_id FROM m_chat WHERE c_send="${sid}" AND c_receive="${f_sid}"`
  let selCIDStr2 = `SELECT c_id FROM m_chat WHERE c_send="${f_sid}" AND c_receive="${sid}"`
  let [selCIDErr1, selCIDRes1] = await query(selCIDStr1)
  let [selCIDErr2, selCIDRes2] = await query(selCIDStr2)
  if (!selCIDErr1 && !selCIDErr2) {

    if (selCIDStr1.length == 0 && selCIDStr2.length == 0) {
      console.log("进入了1");
      res.send(Msg({
        msg: "请求成功",
        code: 200,
        result: []
      }))
    } else if (selCIDRes1.length > 0 && selCIDRes1[0].c_id) {
      console.log("进入了2");
      let selMsgStr = `SELECT * FROM m_chat WHERE c_id="${selCIDRes1[0].c_id}"`
      console.log(selMsgStr, "selMsgStr");
      let [selMsgErr, selMsgRes] = await query(selMsgStr)
      if (!selMsgErr) {
        // 获取聊天人的头像和昵称
        for (var i = 0; i < selMsgRes.length; i++) {
          // 获取发送人的资料
          let infoStr1 = `SELECT sid,nickname,icon FROM member WHERE sid="${selMsgRes[i].c_send}"`
          let [infoErr1, infoRes1] = await query(infoStr1)
          if (!infoErr1) {
            selMsgRes[i].c_send = infoRes1[0]
          }
          // 获取接收人的资料
          let infoStr2 = `SELECT sid,nickname,icon FROM member WHERE sid="${selMsgRes[i].c_receive}"`
          let [infoErr2, infoRes2] = await query(infoStr2)
          if (!infoErr2) {
            selMsgRes[i].c_receive = infoRes2[0]
          }
        }

        // 对获取到的时间进行处理
        selMsgRes.map(item => {
          item.c_time = new Date(parseInt(item.c_time)).getFullYear() + "-" + (new Date(parseInt(item.c_time)).getMonth() + 1) + "-" + new Date(parseInt(item.c_time)).getDate() + " " + new Date(parseInt(item.c_time)).getHours() + ":" + new Date(parseInt(item.c_time)).getMinutes() + ":" + new Date(parseInt(item.c_time)).getSeconds()
        })

        console.log(selMsgRes, "selMsgRes");
        res.send(Msg({
          msg: "请求成功",
          code: 200,
          result: selMsgRes
        }))
      } else {
        next({
          msg: "拉取记录失败，请稍后重试"
        })
      }
    } else if (selCIDRes2.length > 0 && selCIDRes2[0].c_id) {
      console.log("进入了3");
      let selMsgStr = `SELECT * FROM m_chat WHERE c_id="${selCIDRes2[0].c_id}"`
      let [selMsgErr, selMsgRes] = await query(selMsgStr)
      if (!selMsgErr) {

        // 获取聊天人的头像和昵称
        for (var i = 0; i < selMsgRes.length; i++) {
          // 获取发送人的资料
          let infoStr1 = `SELECT sid,nickname,icon FROM member WHERE sid="${selMsgRes[i].c_send}"`
          let [infoErr1, infoRes1] = await query(infoStr1)
          if (!infoErr1) {
            selMsgRes[i].c_send = infoRes1[0]
          }
          // 获取接收人的资料
          let infoStr2 = `SELECT sid,nickname,icon FROM member WHERE sid="${selMsgRes[i].c_receive}"`
          let [infoErr2, infoRes2] = await query(infoStr2)
          if (!infoErr2) {
            selMsgRes[i].c_receive = infoRes2[0]
          }
        }

        // 对获取到的时间进行处理
        selMsgRes.map(item => {
          item.c_time = new Date(parseInt(item.c_time)).getTime()
        })


        res.send(Msg({
          msg: "请求成功",
          code: 200,
          result: selMsgRes
        }))
      } else {
        next({
          msg: "拉取记录失败，请稍后重试"
        })
      }
    }
  }
})

// 消息提示
router.post("/msgPrompt", async (req, res, next) => {
  let { sid } = req.body
  if (!sid) {
    next({
      msg: "缺少必要条件sid"
    })
    return
  }
  /**
   * 1.根据传入的sid搜索c_receive，查询消息列表数据
   * 2.根据消息列表数据中的re_status状态码判断是否已读，未读为0，已读为1
   * 3.查询为状态码0的数据，放入数组，如果长度大于1(说明有未读)，进行提示
   */

  let selStr = `SELECT re_status FROM m_chat WHERE c_receive="${sid}" AND re_status="0"`
  let [selErr, selRes] = await query(selStr)
  if (!selErr) {
    if (selRes.length == 0) {
      res.send(Msg({
        msg: "请求成功",
        code: 200,
        result: "0" // 将未读消息的数量(数组长度)返回给前端
      }))
    } else {
      res.send(Msg({
        msg: "请求成功",
        code: 200,
        result: selRes.length // 将未读消息的数量(数组长度)返回给前端
      }))
    }
  } else {
    next({
      msg: "请求失败，请稍后重试"
    })
  }
})

// 已读消息操作(将未读设置为已读)
router.post("/read", async (req, res, next) => {
  // 根据sid和f_sid获取当前目录下的所有re_status=0的消息，然后将其全部设置为1
  let { sid, f_sid } = req.body
  if (!sid || !f_sid) {
    next({
      msg: "缺少必要参数sid或f_sid"
    })
    return
  }
  let upStr = `UPDATE m_chat SET re_status="1" WHERE c_send="${f_sid}" AND c_receive="${sid}"`
  let [upErr, upRes] = await query(upStr)
  if (!upErr) {
    res.send(Msg({
      msg: "操作成功",
      code: 200,
      result: null
    }))
  }
})


module.exports = router;
