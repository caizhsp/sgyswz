<template>
  <div>
    <img :src="bgurl" alt="" class="bg" />
    <div class="form_info">
      <img :src="logourl" alt="" class="logo" />
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="昵称" class="nickname" label-width="88px">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item
          prop="username"
          label="账号"
          class="username"
          label-width="88px"
        >
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
          class="password"
          label-width="88px"
        >
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item
          class="verify"
          label="确认密码"
          prop="okpwd"
          label-width="88px"
        >
          <el-input v-model="form.okpassword" show-password></el-input>
        </el-form-item>
        <el-form-item class="sex" label="性别" label-width="88px">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          class="code"
          label="验证码"
          prop="code"
          label-width="88px"
        >
          <el-input v-model="form.code"></el-input>
          <!-- <img
            src="https://img2.baidu.com/it/u=3000632557,3460082798&fm=253&fmt=auto&app=138&f=JPEG?w=200&h=148"
            alt=""
            style="width: 80px; height: 40px"
          /> -->
          <img
            src="http://localhost:3000/api/captcha"
            alt=""
            style="width: 100px; height: 50px"
          />
        </el-form-item>
        <el-form-item class="remark" label="介绍" label-width="88px">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label-width="88px">
          <el-button type="success" @click="register">注册</el-button>
          <el-button type="danger" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入注册接口
import { register } from "../utils/axios";

export default {
  data() {
    return {
      bgurl: require("../assets/images/bg.jpg"),
      logourl: require("../assets/images/logo2.png"),
      form: {
        nickname: "",
        username: "",
        password: "",
        okpassword: "",
        sex: 0,
        code: "",
        remark: "",
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
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  mounted() {},
  methods: {
    // 注册事件
    register() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 判断两次的密码是否相同
          if (this.form.password == this.form.okpassword) {
            this.form = {
              nickname: this.form.nickname,
              username: this.form.username,
              password: this.form.password,
              sex: this.form.sex,
              code: this.form.code,
              remark: this.form.remark,
            };
          } else {
            alert("两次输入的密码不一致");
            return;
          }

          register(this.form).then((res) => {
            console.log(res.data,"这次注册的结果");
            alert(res.data.msg); // 将此次注册结果提示给用户
            if(res.data.code == 200){
              this.$router.push("/login")
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
  top: 6%;
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
.code .el-input {
  width: 200px;
  vertical-align: top;
}
.nickname >>> .el-form-item__label,
.username >>> .el-form-item__label,
.password >>> .el-form-item__label,
.verify >>> .el-form-item__label,
.sex >>> .el-form-item__label,
.code >>> .el-form-item__label,
.remark >>> .el-form-item__label {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}
.verify >>> .el-radio__label {
  color: #333;
  font-size: 14px;
  font-weight: bold;
}
</style>