<template>
  <div>
    <img :src="bgurl" alt="" class="bg" />
    <div class="form_info">
      <img :src="logourl" alt="" class="logo" />
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item prop="username" label="账号" class="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" class="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="success" @click="register">注册</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入接口文件
import { login } from "../utils/axios/index";
export default {
  data() {
    return {
      bgurl: require("../assets/images/bg.jpg"),
      logourl: require("../assets/images/logo2.png"),
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 18,
            message: "账号长度为3~18位",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
            message: "密码必须同时包含数字与字母,且长度为 6-20位",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 注册事件
    register() {
      this.$router.push("/register");
    },
    // 登录事件
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log(this.form, "登录表单信息");
          login(this.form).then((res) => {
            if (res.data.code == 200) {
              // 登录成功之后将信息储存到sessionStorage中
              sessionStorage.setItem(
                "userInfo",
                JSON.stringify(res.data.result)
              );
              this.$message({
                type: "success",
                message: "登录成功!",
              });
              // 判断是否从个人资料页跳转的，如果是，登录完成之后回跳
              if (!sessionStorage.getItem("history")) {
                this.$router.push("/index"); // 如果不是，则正常登录流程，跳转主页
              }else{
                this.$router.push(sessionStorage.getItem("history"))
              }
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
            }
          });
        }
      });
    },
    // 重置事件
    reset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang='' scoped>
.bg {
  position: absolute;
  width: 100vw;
  height: 100vh;
  opacity: 0.5;
}
.form_info {
  position: absolute;
  left: 50%;
  margin-left: -320px;
  top: 20%;
  height: 500px;
  width: 580px;
}
.form_info .el-form {
  position: absolute;
  top: 26%;
}
.logo {
  position: absolute;
  width: 20vw;
  /* left: 13%; */
  left: 23%;
  /* margin-left: -125px; */
}
.el-input {
  width: 500px;
}
.username >>> .el-form-item__label,
.password >>> .el-form-item__label {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}
</style>