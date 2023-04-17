<template>
  <div class="con">
    <div class="info" v-if="results.length > 0">
      <div class="item" v-for="item in results" :key="item.id">
        <img
          :src="$nodeurl + item.cover"
          alt=""
          class="item_img"
          @click="toDetail(item.mid)"
        />
        <div class="item_info">
          <p class="item_info_title" @click="toDetail(item.mid)">
            {{ item.name }}
          </p>
          <p>
            上映时间：<span style="font-size: 16px">{{ item.on_time }}</span>
          </p>
          <p>
            演员：<span
              v-for="item in item.artist"
              :key="item"
              style="font-size: 16px"
              >{{ item }}<span> / </span></span
            >
          </p>
        </div>
      </div>
    </div>
    <div class="info" v-else>
      <p class="none">暂时没有收录哟</p>
    </div>
  </div>
</template>

<script>
// 引入接口
import { search } from "../utils/axios";

export default {
  data() {
    return {
      imgurl: require("../assets/images/aqgy.webp"),
      results: [],
    };
  },
  methods: {
    toDetail(mid) {
      this.$router.push("/details?mid=" + mid);
    },
  },
  mounted() {
    let keyword = this.$route.query.key;
    console.log(keyword);
    if (!keyword) {
      //   alert("出错了");
      this.$router.back();
    } else {
      search(keyword).then((res) => {
        if (res.data.code == 200) {
          this.results = res.data.result;
          console.log(this.results, "结果");
        } else {
          alert(res.data.msg);
        }
      });
    }
  },
};
</script>

<style lang='' scoped>
.con {
  width: 1200px;
  margin: 20px auto;
  /* background-color: rgba(212, 170, 170, 0.438); */
}
.item {
  clear: both;
  height: 130px;
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
}
.item_img {
  float: left;
  width: 80px;
  height: 120px;
  margin-right: 30px;
  cursor: pointer;
}
.item_info {
  float: left;
}
.item_info p {
  font-size: 18px;
  line-height: 30px;
  color: #333;
}
.item_info .item_info_title {
  font-size: 24px;
  line-height: 60px;
  color: rgb(156, 18, 168);
  cursor: pointer;
}
.none {
  text-align: center;
  margin-top: 20%;
  font-size: 50px;
  color: #333;
}
</style>