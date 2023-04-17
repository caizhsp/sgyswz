<template>
  <div class="con">
    <h1 class="h1">
      {{ title }} {{ $route.query.short == 1 ? "短评" : "长评" }}
    </h1>
    <div v-for="item in commentList" :key="item.time">
      <div class="info">
        <img :src="$nodeurl + item.icon" alt="" class="icon" />
        <span class="nickname">{{ item.nickname }}</span>
        <span class="time">{{ item.com_time }}</span>
      </div>
      <div class="comment-con" v-html="item.content"></div>
      <hr />
    </div>
  </div>
</template>

<script>
import { getdetails, commentshort, commentlong } from "../utils/axios";

export default {
  data() {
    return {
      title: "默认的",
      commentList: [
        {
          icon: require("../assets/images/usericon/user1.jpeg"),
          nickname: "疯狂的张三",
          con_time: "2022-3-16 20:10:13",
          content:
            "又让喜剧片给整哭了，当魏翔说出“这是我第一部男主角”的时候，那种心酸我想所有的喜剧人都能体会吧！",
        },
      ],
    };
  },
  mounted() {
    let { all, mid, short } = this.$route.query;
    // 获取影名信息，渲染标题
    getdetails(mid).then((res) => {
      if (res.data.code == 200) {
        this.title = res.data.result.name;
      }
    });
    // 获取mid和all，渲染评论数据
    if (short == 1) {
      commentshort({
        mid: this.$route.query.mid,
        all,
      }).then((res) => {
        if (res.data.code == 200) {
          this.commentList = res.data.result.short;
        }
        // this.commentList = res.data.result;
      });
    } else {
      commentlong({
        mid: this.$route.query.mid,
        all,
      }).then((res) => {
        if (res.data.code == 200) {
          this.commentList = res.data.result.long;
        }
      });
    }
  },
};
</script>

<style lang='' scoped>
.con {
  width: 1200px;
  margin: 50px auto;
  /* background-color: #bfa; */
}
.con .h1 {
  margin-bottom: 30px;
}

.info .icon {
  margin-top: 20px;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  vertical-align: middle;
  margin-right: 20px;
}
.info .nickname,
.info .time {
  font-size: 20px;
  font-weight: bold;
  color: orange;
}
.info .time {
  color: #333;
  margin-left: 30px;
}
.comment-con {
  margin: 20px 10px 20px 80px;
}
</style>