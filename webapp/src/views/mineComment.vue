<template>
  <div class="con">
    <h1>
      {{ $route.query.sid == undefined ? "我" : "TA" }}的{{
        $route.query.short == 1 ? "短评" : "长评"
      }}
    </h1>
    <ul>
      <li v-for="item in commentItem" :key="item.id">
        <div class="com_con" v-html="item.content"></div>
        <p class="com_info">
          ------来自影视«<span @click="todetails(item.mid)" class="todetails">{{
            item.name
          }}</span
          >» {{ item.com_time }}
        </p>
      </li>
      <li>
        <p class="com_con">很想多给魏翔一颗星，但是电影后面实在是有些垮</p>
        <p class="com_info">------来自影视«这个杀手不太冷静» 2022-3-16 19:40</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { getMyCom } from "../utils/axios";

export default {
  data() {
    return {
      commentItem: [],
    };
  },
  methods: {
    todetails(mid) {
      this.$router.push("/details?mid=" + mid);
    },
  },
  mounted() {
    let sid;
    // 如果路由中没有参数，说明是已经登录，缓存中取出数据
    if (!this.$route.query.sid) {
      sid = JSON.parse(sessionStorage.getItem("userInfo")).sid;
    } else {
      sid = this.$route.query.sid;
    }

    getMyCom({
      sid,
      size: this.$route.query.size,
    }).then((res) => {
      if (res.data.code == 200) {
        if (this.$route.query.short == 1) {
          this.commentItem = res.data.result.short;
        } else {
          this.commentItem = res.data.result.long;
        }
      }
    });
    // if (!sessionStorage.getItem("userInfo")) {
    //   alert("请求错误");
    //   this.$router.push("/index");
    // }
    // console.log(JSON.parse(sessionStorage.getItem("userInfo")).sid);
  },
};
</script>

<style lang='' scoped>
.con {
  width: 1200px;
  margin: 0 auto;
}
h1 {
  font-size: 36px;
  line-height: 70px;
}

ul li {
  border-bottom: 1px solid #333;
}

.com_con {
  font-size: 16px;
  padding: 20px 0px 50px 0px;
  line-height: 30px;
  text-indent: 2em;
  color: #443636;
}

.com_info {
  float: right;
  margin-top: -28px;
  margin-right: 30px;
  color: #8d8484;
}

.todetails {
  cursor: pointer;
}
.todetails:hover {
  color: red;
}
</style>