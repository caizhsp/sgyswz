<template>
  <div>
    <!-- 影片信息 -->
    <div class="mov-info">
      <p class="mov-name">
        {{ movInfo.name }}
      </p>
      <div class="info-con">
        <img :src="$nodeurl + movInfo.cover" alt="" class="mov-img" />
        <div class="mov-textinfo">
          <p>
            导演：<span style="color: #8a0200">{{
              movInfo.director.d_name ? movInfo.director.d_name : ""
            }}</span>
          </p>
          <p>
            编剧：<span
              v-for="item in movInfo.bianju"
              :key="item"
              style="color: #8a0200"
              >{{ item }}<span style="color: #747787"> / </span></span
            >
          </p>
          <div>
            主演：
            <p style="width: 500px; display: inline-block; vertical-align: top">
              <span
                v-for="item in movInfo.artists"
                :key="item.name"
                style="color: #8a0200"
                >{{ item.name }}<span style="color: #747787"> / </span></span
              >
            </p>
          </div>
          <p>
            类型：<span v-for="item in movInfo.sort" :key="item"
              >{{ item }}<span> / </span></span
            >
          </p>
          <p>语言：普通话</p>
          <p>制片国家/地区：中国大陆</p>
          <p>上映时间：{{ movInfo.on_time }}(中国大陆)</p>
        </div>
      </div>
      <div class="write">
        <i class="el-icon-chat-line-round"></i
        ><span class="write-comment" @click="writeShort">写短评</span>
        <i class="el-icon-edit"></i
        ><span class="write-comment" @click="writeLong">写影评</span>
        <div style="display: inline" v-if="isCollect">
          <i class="el-icon-star-on"></i
          ><span @click="collect" class="write-comment">已收藏</span>
        </div>
        <div style="display: inline" v-else>
          <i class="el-icon-star-off"></i
          ><span @click="collect" class="write-comment">收藏</span>
        </div>

        <i class="el-icon-paperclip"></i>
        <el-dropdown>
          <span class="el-dropdown-link">
            分享到<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>微信</el-dropdown-item>
            <el-dropdown-item>QQ</el-dropdown-item>
            <el-dropdown-item>微博</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 剧情简介 -->
      <div class="synopsis">
        <h3 class="title h3title">剧情简介</h3>
        <div v-html="movInfo.details" class="details"></div>
      </div>
      <!-- 演职员表 -->
      <div class="actor">
        <h3 class="title h3title">演职员表</h3>
        <el-row class="act-row">
          <el-col
            :span="8"
            v-for="(item, index) in movInfo.artistshow"
            :key="index"
            :offset="index > 0 ? 2 : 0"
            class="act-col"
          >
            <el-card :body-style="{ padding: '0px' }" class="act-card">
              <img :src="$nodeurl + item.icon" class="act-image" />
              <div style="padding: 14px" class="act-info">
                <p>{{ item.name }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 影片短评 -->
      <div class="short-com">
        <h3 class="h3title">
          影片短评......<span
            @click="AllShortComment"
            style="
              font-size: 14px;
              margin-left: 30px;
              color: #3377aa;
              cursor: pointer;
            "
            >(全部短评)</span
          >
        </h3>
        <!-- 筛选 -->
        <div class="screen">
          <span
            :class="shortScreen == 'hot' ? ' screen-checked ' : ' '"
            @click="shortHot"
            style="cursor: pointer"
          >
            热门
          </span>
          <span> / </span>
          <span
            :class="shortScreen == 'new' ? ' screen-checked ' : ' '"
            @click="shortNew"
            style="cursor: pointer"
            >最新</span
          >
          <span> / </span>
          <span
            :class="shortScreen == 'friends' ? ' screen-checked ' : ' '"
            @click="shortFriend"
            style="cursor: pointer"
            >好友</span
          >
          <el-button
            type="warning"
            plain
            icon="el-icon-edit"
            class="short-btn"
            @click="writeShort"
            >我要写短评</el-button
          >
          <div v-if="shortItem.length > 0">
            <div
              class="short-item"
              v-for="(item, index) in shortItem"
              :key="index"
            >
              <hr />
              <p @click="lookUser(item.sid)" style="cursor: pointer">
                <el-avatar
                  :src="$nodeurl + item.icon"
                  shape="square"
                  class="short-item-icon"
                ></el-avatar>

                <span class="short-item-name" href="#">{{ item.nickname }}</span
                ><span class="short-item-time">{{ item.com_time }}</span
                ><a href="#" style="color: #333"
                  ><i class="el-icon-star-on short-item-icon"></i
                ></a>
                <span class="short-item-total">{{ item.heat }}</span>
              </p>
              <div class="short-item-con" v-html="item.content"></div>
            </div>
          </div>
          <div v-else>
            <div class="commentNone">
              <hr />
              <h2>暂无数据，快去评论吧</h2>
            </div>
          </div>
        </div>
        <hr class="last-line" />
        <!-- 短评分页 -->
        <div class="page-content">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="shortCount"
            class="short-pagination"
            :page-size="4"
            @current-change="currentChange"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 影片长评(影评) -->
      <div class="short-com">
        <h3 class="h3title">
          热门影评......<span
            @click="AllLongComment"
            style="
              font-size: 14px;
              margin-left: 30px;
              color: #3377aa;
              cursor: pointer;
            "
            >(全部影评)</span
          >
        </h3>
        <!-- 筛选 -->
        <div class="screen">
          <span
            href="#"
            :class="longScreen == 'hot' ? ' screen-checked ' : ' '"
            @click="longHot"
            style="cursor: pointer"
            >热门</span
          >
          <span> / </span>
          <span
            href="#"
            :class="longScreen == 'new' ? ' screen-checked ' : ' '"
            @click="longNew"
            style="cursor: pointer"
            >最新</span
          >
          <span> / </span>
          <span
            href="#"
            :class="longScreen == 'friend' ? ' screen-checked ' : ' '"
            @click="longFriend"
            style="cursor: pointer"
            >好友</span
          >
          <el-button
            type="warning"
            plain
            icon="el-icon-edit"
            class="short-btn"
            @click="writeLong"
            >我要写影评</el-button
          >
          <div v-if="longItem.length > 0">
            <div
              class="short-item"
              v-for="(item, index) in longItem"
              :key="index"
            >
              <hr />
              <p @click="lookUser(item.sid)" style="cursor: pointer">
                <el-avatar
                  :src="$nodeurl + item.icon"
                  shape="square"
                  class="short-item-icon"
                ></el-avatar>

                <span class="short-item-name" href="#">{{ item.nickname }}</span
                ><span class="short-item-time">{{ item.com_time }}</span
                ><a href="#" style="color: #333"
                  ><i class="el-icon-star-on short-item-icon"></i
                ></a>
                <span class="short-item-total">{{ item.heat }}</span>
              </p>
              <div class="short-item-con" v-html="item.content"></div>
            </div>
          </div>
          <div v-else>
            <div class="commentNone">
              <hr />
              <h2>暂无数据，快去评论吧</h2>
            </div>
          </div>
        </div>
        <hr class="last-line" />
        <!-- 长评分页 -->
        <div class="page-content">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="longCount"
            class="short-pagination"
            :page-size="4"
            @current-change="currentChange2"
          >
          </el-pagination>
        </div>
        <!-- 发表评论对话框 -->
        <publish-dialog
          :dialogInfo="dialogInfo"
          @refresh="refresh"
        ></publish-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// 引入头部导航栏
import navMenu from "../components/NavMenu.vue";
// 引入对话框组件
import publishDialog from "../components/publish-dialog.vue";
// 引入接口
import { getUserInfo } from "../utils/axios";
// 引入接口
import {
  getdetails,
  commentshort,
  commentlong,
  commentCount,
  movcollect,
} from "../utils/axios";

export default {
  data() {
    return {
      isCollect: false,
      longScreen: "hot",
      shortScreen: "hot",
      dialogInfo: {
        isShort: false,
        isShow: false,
      },
      shortItem: [],
      longItem: [],
      shortCount: 1,
      longCount: 1,
      movInfo: {
        director: false,
      },
    };
  },
  methods: {
    // 查看用户资料
    lookUser(sid) {
      // console.log(sid, "点击了");
      this.$router.push("/personInfo?sid=" + sid);
    },
    // 收藏
    collect() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      if (!userInfo) {
        this.$message.warning("你还未登录，请先登录");
        return;
      } else {
        this.isCollect = !this.isCollect;
        let data = {
          sid: userInfo.sid,
          mid: this.$route.query.mid,
        };
        movcollect(data).then((res) => {
          if (res.data.code == 200) {
            console.log(res.data.result,"返回的数据");
            // let info = res.data.result

            this.$resetSetItem("userInfo", JSON.stringify(res.data.result));
            sessionStorage.setItem("userInfo", JSON.stringify(res.data.result)); // 存入到缓存中
            this.$message({
              type: "success",
              message: res.data.msg,
            });
          }
        });
      }
    },
    // 全部评论
    AllLongComment() {
      this.$router.push(
        "/comment?mid=" + this.$route.query.mid + "&all=true&short=2"
      );
    },
    AllShortComment() {
      this.$router.push(
        "/comment?mid=" + this.$route.query.mid + "&all=true&short=1"
      );
    },
    // 长评筛选切换
    longFriend() {
      this.longScreen = "friend";
      commentlong({
        mid: this.$route.query.mid,
        rank: this.longScreen,
      }).then((res) => {
        if (res.data.code == 200) {
          this.longItem = res.data.result.long;
        }
      });
    },
    longNew() {
      this.longScreen = "new";
      commentlong({
        mid: this.$route.query.mid,
        rank: this.longScreen,
      }).then((res) => {
        if (res.data.code == 200) {
          this.longItem = res.data.result.long;
        }
      });
    },
    longHot() {
      this.longScreen = "hot";
      commentlong({
        mid: this.$route.query.mid,
        rank: this.longScreen,
      }).then((res) => {
        if (res.data.code == 200) {
          this.longItem = res.data.result.long;
        }
      });
    },
    // 短评筛选切换
    shortFriend() {
      this.shortScreen = "friend";
      commentshort({
        mid: this.$route.query.mid,
        rank: this.shortScreen,
      }).then((res) => {
        if (res.data.code == 200) {
          this.shortItem = res.data.result.short;
        }
      });
    },
    shortNew() {
      this.shortScreen = "new";
      commentshort({
        mid: this.$route.query.mid,
        rank: this.shortScreen,
      }).then((res) => {
        if (res.data.code == 200) {
          this.shortItem = res.data.result.short;
        }
      });
    },
    shortHot() {
      this.shortScreen = "hot";
      commentshort({
        mid: this.$route.query.mid,
        rank: this.shortScreen,
      }).then((res) => {
        if (res.data.code == 200) {
          this.shortItem = res.data.result.short;
        }
      });
    },
    // 长评当前页码改变事件
    currentChange2(currentpage) {
      // 重新请求分页接口，获取对应页面的数据
      commentlong({
        mid: this.$route.query.mid,
        page: currentpage,
      }).then((res) => {
        if (res.data.code == 200) {
          this.longItem = res.data.result.long;
        }
      });
    },
    // 短评当前页码改变事件
    currentChange(currentpage) {
      // 重新请求分页接口，获取对应页面的数据
      commentshort({
        mid: this.$route.query.mid,
        page: currentpage,
      }).then((res) => {
        if (res.data.code == 200) {
          this.shortItem = res.data.result.short;
        }
      });
    },
    // 刷新事件
    refresh() {
      console.log("触发");
      // 更改评论总条数
      commentCount(this.$route.query.mid).then((res) => {
        if (res.data.code == 200) {
          this.shortCount = res.data.result.shortCount;
          this.longCount = res.data.result.longCount;
        }
      });

      commentshort({
        mid: this.$route.query.mid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.shortItem = res.data.result.short;
        }
      });
      commentlong({
        mid: this.$route.query.mid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.longItem = res.data.result.long;
        }
      });
    },
    // 发表短评事件
    writeShort() {
      this.dialogInfo = {
        isShort: true,
        isShow: true,
      };
    },
    // 发表影评论（长评）事件
    writeLong() {
      this.dialogInfo = {
        isShort: false,
        isShow: true,
      };
    },
  },
  mounted() {
    // console.log(this.$route.query.mid, "路径地址");
    if (this.$route.query.mid == undefined) {
      alert("查询失败");
      return;
    }
    getdetails(this.$route.query.mid).then((res) => {
      // console.log(res.data.result, "ressssss");
      if (res.data.code == 200) {
        this.movInfo = res.data.result;

        // 对演职员表数据进行合并处理
        let artists = [];
        artists.push({
          name: this.movInfo.director.d_name,
          icon: this.movInfo.director.d_icon,
        });
        if (this.movInfo.artists.length > 7) {
          this.movInfo.artists.slice(0, 6).map((item) => {
            artists.push(item);
          });
        } else {
          this.movInfo.artists.map((item) => {
            artists.push(item);
          });
        }
        // 对组合后的数据进行去重处理
        let repeatIndex = false;
        for (var i = 0; i < artists.length - 1; i++) {
          if (artists[i + 1].name == artists[i].name) {
            repeatIndex = i + 1;
          }
        }
        if (repeatIndex) {
          artists.splice(repeatIndex, 1);
        }
        this.movInfo.artistshow = artists;

        // 获取评论总数
        commentCount(this.$route.query.mid).then((res) => {
          if (res.data.code == 200) {
            this.shortCount = res.data.result.shortCount;
            this.longCount = res.data.result.longCount;
          }
        });

        // 取出评论
        commentshort({
          mid: this.$route.query.mid,
          page: 1,
        }).then((res) => {
          if (res.data.code == 200) {
            this.shortItem = res.data.result.short;
          }
        });
        commentlong({
          mid: this.$route.query.mid,
          page: 1,
        }).then((res) => {
          if (res.data.code == 200) {
            this.longItem = res.data.result.long;
          }
        });
      }
    });

    if (JSON.parse(sessionStorage.getItem("userInfo"))) {
      this.isCollect = JSON.parse(
        sessionStorage.getItem("userInfo")
      ).collects.some((item) => {
        return item == this.$route.query.mid;
      });

      window.addEventListener("setItem", () => {
        this.isCollect = JSON.parse(
          sessionStorage.getItem("userInfo")
        ).collects.some((item) => {
          return item == this.$route.query.mid;
        });
      });
    }
  },
  components: {
    navMenu,
    publishDialog,
  },
};
</script>

<style lang='' scoped>
.info-con {
  margin-bottom: 20px;
}
.mov-info {
  width: 1200px;
  /* background-color: rgba(234, 31, 31, 0.3); */
  position: absolute;
  left: 15%;
  top: 10%;
}
.mov-name {
  font-size: 30px;
  font-weight: bold;
  color: #494949;
  margin-bottom: 20px;
}
.mov-img {
  width: 200px;
  height: 280px;
  float: left;
  margin-right: 20px;
  margin-bottom: 20px;
}
.mov-textinfo {
  color: #747774;
  font-size: 18px;
}
.mov-textinfo p {
  line-height: 40px;
}
.mov-textinfo div {
  line-height: 40px;
}
.mov-textinfo p a {
  color: #4077aa;
}
.write {
  clear: both;
  font-size: 18px;
  margin-bottom: 30px;
}
.write i {
  margin-right: 5px;
}
.write a {
  margin-right: 10px;
}
.write a:hover {
  color: orange;
}
/* 分享下拉菜单样式 */
.el-dropdown .el-dropdown-link {
  font-size: 18px;
  cursor: pointer;
  color: rgb(71, 71, 71);
}
.el-dropdown .el-dropdown-link:hover {
  color: orange;
}
.el-dropdown-menu {
  width: 100px;
}
.synopsis {
  margin-bottom: 20px;
}
.h3title {
  color: #42864d;
  font-size: 26px;
  line-height: 60px;
}
.synopsis .details {
  line-height: 30px;
  width: 1000px;
  font-size: 18px;
}
/* 演员表图片样式 */
.act-image {
  width: 130px;
  height: 175px;
}
.act-card {
  width: 130px;
  background-color: transparent;
  border: none;
  box-shadow: none;
}
.act-col {
  width: 130px;
  margin-right: -75px;
}

.act-info p {
  text-align: center;
  font-size: 14px;
}
.act-info .site {
  color: #a1a3a1;
}
/* 影片相关截图 */
.cut-image {
  width: 150px;
  height: 200px;
}
.cut-card {
  width: 150px;
  background-color: transparent;
  border: none;
  box-shadow: none;
}
.cut-col {
  width: 150px;
  margin-right: -75px;
}
/* 短评 */
.short-btn {
  height: 36px;
  padding: 10px 20px;
  float: right;
  margin-right: 200px;
  color: #d48103;
  font-size: 18px;
  border: none;
}
/* 选中筛选项 */
.screen .screen-checked {
  color: orange;
  font-weight: bold;
}
/* 短评项 */

.short-item {
  font-size: 18px;
  margin-top: 30px;
}
.short-item hr {
  margin-bottom: 20px;
  border: 1px solid rgba(185, 185, 185, 0.26);
}
.short-item p {
  line-height: 20px;
}
.short-item-name {
  display: inline-block;
  width: 260px;
  margin-right: 50px;
  color: rgb(122, 0, 71);
}
.short-item-time {
  margin-right: 420px;
  color: #bdaaaa;
}
.short-item-icon {
  font-size: 20px;
}
.short-item .short-item-con {
  font-size: 14px;
  text-indent: 28px;
  line-height: 30px;
  width: 750px;
  margin-top: 20px;
  color: #606360;
}
.short-item:last-child {
  margin-bottom: 10px;
}
.last-line {
  border: 1px solid rgba(185, 185, 185, 0.26);
}
.short-item-icon {
  margin-right: 5px;
  vertical-align: middle;
}
/* 短评分页 */
.short-pagination {
  margin-top: 20px;
  float: right;
  height: 30px;
}
/* 分页器容器 */
.page-content {
  height: 70px;
}

.commentNone {
  margin-top: 30px;
  height: 100px;
  text-align: center;
  color: grey;
  line-height: 60px;
}

.commentNone hr {
  margin-bottom: 20px;
  border: 1px solid rgba(185, 185, 185, 0.26);
}

.write .write-comment {
  color: #761a9e;
  cursor: pointer;
}
.write .write-comment:hover {
  color: #ffa500;
}
</style>