<template>
  <div>
    <div class="con">
      <h1>
        分类关键词：<span class="keywords">{{ $route.name }}</span
        >的搜索结果
      </h1>
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
  </div>
</template>

<script>
// 引入接口
import { sort } from "../utils/axios";

export default {
  data() {
    return {
      results: [],
    };
  },
  methods: {
    toDetail(mid) {
      this.$router.push("/details?mid=" + mid);
    },
  },
  mounted() {
    sort(this.$route.name).then((res) => {
      if (res.data.code == 200) {
        this.results = res.data.result;
      }
    });
  },
};
</script>

<style lang='' scoped>
.con {
  width: 1200px;
  margin: 10px auto;
}
.con h1 {
  margin-bottom: 30px;
}
.con .keywords {
  color: red;
  margin: 0px 10px;
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
</style>