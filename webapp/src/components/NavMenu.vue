<template>
  <div>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        router
      >
        <img :src="logourl" alt="" class="logo" />
        <el-menu-item index="search" :route="'/index'">首页</el-menu-item>
        <el-menu-item index="hot" route="/hot">热榜</el-menu-item>
        <el-menu-item index="new" route="/new">新榜</el-menu-item>
        <el-menu-item index="top" route="/top">TOP</el-menu-item>
        <el-menu-item index="commend" route="/commend">推荐</el-menu-item>
        <el-submenu index="sort">
          <template slot="title">分类</template>
          <el-menu-item
            :index="item.nickname"
            v-for="item in sortList"
            :key="item.nickname"
            :route="'/sort-' + item.nickname"
            >{{ item.name }}</el-menu-item
          >
        </el-submenu>
        <!-- <el-menu-item index="6" class="mine">个人中心</el-menu-item> -->
        <el-menu-item index="6" class="mine" v-if="loginInfo == ''">
          <el-link
            :href="$url + 'login'"
            target="_blank"
            type="primary"
            :underline="false"
            >登录</el-link
          >
          <el-link
            :href="$url + 'register'"
            target="_blank"
            type="primary"
            :underline="false"
            >注册</el-link
          >
        </el-menu-item>

        <el-menu-item class="exit" v-if="loginInfo != ''">
          <span style="color: #333" @click="exit">退出</span>
        </el-menu-item>
        <!-- 登录之后显示登录后的信息 -->
        <el-menu-item
          index="6"
          route="/personInfo"
          class="mine"
          v-if="loginInfo != ''"
        >
          <div @click="toMine">
            <el-avatar :src="$nodeurl + loginInfo.icon"></el-avatar>
            <span style="color: #333"
              >欢迎你，<span style="color: purple">{{
                loginInfo.nickname
              }}</span></span
            >
            <span
              class="msg"
              v-if="loginInfo.addMsg.length > 0"
              @click.stop="lookMsg"
              >新的好友请求</span
            >
            <span class="msg" v-if="prompt > 0">你有{{ prompt }}条新消息</span>
          </div>
        </el-menu-item>
      </el-menu>
    </el-header>
    <add-dialog :addList="addList" v-if="loginInfo != ''"></add-dialog>
  </div>
</template>

<script>
// 引入接口
import { login, getsort, msgPrompt } from "../utils/axios";
// 引入子组件
import addDialog from "../components/addDialog.vue";

export default {
  data() {
    return {
      prompt: "",
      addList: {
        isShow: false,
      },
      sortList: [],
      activeIndex: "search",
      logourl: require("../assets/images/logo.png"),
      loginInfo: "", // 登录信息
    };
  },
  components: { addDialog },
  methods: {
    // 查看添加好友消息
    lookMsg() {
      this.addList = {
        isShow: true,
      };
    },
    // 退出事件
    exit() {
      // 提示退出
      this.$confirm("是否确认退出本次登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 先清除缓存中的数据
          sessionStorage.removeItem("userInfo");
          // 清空loginInfo中的信息
          this.loginInfo = "";
          // 再返回到主页
          this.$router.push("/index");

          this.$message({
            type: "success",
            message: "退出成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    toRouter() {
      this.$router.push("/ranking?type=" + this.activeIndex);
    },
    // 点击头像跳转到个人中心
    toMine() {
      this.$router.push("/personInfo");
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
  },
  mounted() {
    window.addEventListener("setItem", () => {
      this.loginInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    });
    window.addEventListener("setItemT", () => {
      this.prompt = sessionStorage.getItem("prompt");
    });

    this.activeIndex = this.$route.path.split("").splice(1).join("");

    // 获取用户分类信息
    getsort().then((res) => {
      if (res.data.code == 200) {
        this.sortList = res.data.result;
      }
    });

    // console.log(this.$url + "login");
    // 检测是否登录，已登录显示登录后的头像框和昵称
    if (JSON.parse(sessionStorage.getItem("userInfo"))) {
      this.loginInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      msgPrompt({
        sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.prompt = parseInt(res.data.result);
          sessionStorage.setItem("prompt", this.prompt);
        }
      });
    }
  },
};
</script>

<style lang='' scoped>
.el-header {
  height: 61px !important;
  line-height: 44px;
  /* background-color: #333; */
  color: #fff;
}

.el-menu .el-menu-item,
.el-menu .el-submenu,
.el-menu >>> .el-submenu__title {
  font-size: 16px;
}
.el-menu .mine {
  color: red;
  float: right !important;
  margin-right: -800px;
}
.el-menu .exit {
  color: red;
  float: right !important;
  margin-right: -850px;
}
.el-menu {
  margin-left: 50px;
  margin-left: 120px;
}
/* 登录注册样式 */
.el-menu >>> .el-link {
  font-size: 16px;
}
.logo {
  height: 61px;
  position: absolute;
  left: -120px;
}
.msg {
  font-size: 12px;
  background-color: red;
  color: #fff;
  cursor: pointer;
  padding: 3px;
  border-radius: 3px;
  border: 1px solid red;
}
</style>