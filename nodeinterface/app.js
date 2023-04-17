var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// cookie-session
var cookieSession = require("cookie-session")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addMovRouter = require('./routes/mov');
var usersRouter = require("./routes/users")
var artistRouter = require("./routes/artist")
var detailsRouter = require("./routes/details")
var commentRouter = require("./routes/comment")
var mineRouter = require("./routes/mine")

// 引入错误处理工具
const { Msg } = require("./utils/error")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 设置cookie-session
app.use(cookieSession({
  name: 'sessionids', // 非必须 默认不用设置
  keys: ['sadfasd', 'dasdasdfas', 'dsadasd'] // 必须，不设置会报错
}))
app.use('/static', express.static(path.join(__dirname, 'static'))) // 开放static静态资源

app.use('/', indexRouter);
// 添加影视剧接口
app.use("/api", addMovRouter)
// 注册接口
app.use("/api", usersRouter)
// 演员接口
app.use("/api", artistRouter)
// 影视详情接口
app.use("/api", detailsRouter)
// 评论接口
app.use("/api", commentRouter)
// 个人中心
app.use("/api", mineRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// 捕捉404错误
app.use(function (req, res, next) {
  next(Msg({}));
});

// 处理逻辑错误
app.use(function (err, req, res, next) {
  res.send(Msg(err))
});

module.exports = app;
