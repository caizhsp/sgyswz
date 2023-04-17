<template>
  <div>
    <div class="search_control">
      <img :src="logourl" alt="" class="logo" />
      <!-- 从服务端搜索数据的输入框 -->
      <el-autocomplete
        class="search"
        v-model="state"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="toSearch"
      ></el-button>
    </div>
    <!-- 热榜卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span> 热榜 </span>
      </div>
      <div
        v-for="(item, index) in hotList"
        :key="index"
        class="text item"
        @click="toDetail(item.mid)"
      >
        {{ item.name }}
      </div>
    </el-card>
    <el-card class="box-card new-card">
      <div slot="header" class="clearfix">
        <span> 新榜 </span>
      </div>
      <div
        v-for="(item, index) in newsList"
        :key="index"
        class="text item"
        @click="toDetail(item.mid)"
      >
        {{ item.name }}
      </div>
    </el-card>
    <el-card class="box-card top-card">
      <div slot="header" class="clearfix">
        <span> TOP榜 </span>
      </div>
      <div
        v-for="(item, index) in topList"
        :key="index"
        class="text item"
        @click="toDetail(item.mid)"
      >
        {{ item.name }}
      </div>
    </el-card>
    <el-card class="box-card com-card">
      <div slot="header" class="clearfix">
        <span> 推荐 </span>
      </div>
      <div
        v-for="(item, index) in commendList"
        :key="index"
        class="text item"
        @click="toDetail(item.mid)"
      >
        {{ item.name }}
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入接口
import { getmovlist, hot, _new, top, commend } from "../utils/axios";

export default {
  data() {
    return {
      restaurants: [],
      state: "",
      timeout: null,
      logourl: require("../assets/images/logo2.png"),
      topList: [],
      newsList: [],
      hotList: [],
      commendList: [],
    };
  },
  methods: {
    // 跳转详情页事件
    toDetail(mid) {
      this.$router.push("/details?mid=" + mid);
    },
    // 点击搜索事件
    toSearch() {
      console.log("点击了");
      this.$router.push("/searchRes?key=" + this.state);
    },

    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    async loadAll() {
      return await getmovlist().then((res) => {
        if (res.data.code == 200) {
          return res.data.result;
        }
      });
    },
    handleSelect(item) {
      // console.log(item);
      this.$router.push("/details?mid=" + item.mid);
    },
  },
  async mounted() {

    // 联想查找关键词赋值
    this.restaurants = await this.loadAll();

    hot().then((res) => {
      if (res.data.code == 200) {
        this.hotList = res.data.result.list.splice(0, 7);
      }
    });
    _new().then((res) => {
      if (res.data.code == 200) {
        this.newsList = res.data.result.list.splice(0, 7);
      }
    });
    top().then((res) => {
      if (res.data.code == 200) {
        this.topList = res.data.result.list.splice(0, 7);
      }
    });
    commend().then((res) => {
      if (res.data.code == 200) {
        this.commendList = res.data.result.list.splice(0, 7);
      }
    });
  },
};
</script>

<style lang='' scoped>
.search_control {
  position: absolute;
  left: 50%;
  margin-left: -450px;
  top: 20%;
  height: 60px;
}
/* 将输入框与按钮顶部对齐 */
.search {
  vertical-align: top;
}
.search >>> .el-input {
  width: 700px;
  height: 60px;
}
.search >>> .el-input__inner {
  height: 60px;
}
.el-button {
  height: 60px;
  width: 90px;
  font-size: 26px;
  /* line-height: 50px; */
}
/* logo样式 */
.logo {
  display: block;
  width: 20vw;
  margin-bottom: 20px;
  margin-left: 30%;
}
/* 卡片样式 */
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 280px;
  position: absolute;
  top: 50%;
  left: 15%;
}
.new-card {
  position: absolute;
  left: 32%;
}
.top-card {
  position: absolute;
  left: 49%;
}
.com-card {
  position: absolute;
  left: 66%;
}

.box-card .text {
  cursor: pointer;
  color: red;
}
.box-card .text:hover {
  color: blue;
}
</style>