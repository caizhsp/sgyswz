<template>
  <div>
    <div class="con">
      <!-- Swiper轮播图 -->
      <div class="swiper-container mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in bannerList" :key="item.mid">
            <img :src="$nodeurl + item.cover" alt="" class="bannerImg" />
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <!-- 热榜列表 -->
      <p class="movTitle">
        详细榜单<span class="rank">
          <!-- <span class="desc">降序</span> / <span class="asc">升序</span> -->
        </span>
      </p>
      <ul class="movList">
        <li
          v-for="item in movList"
          :key="item.mid"
          class="movInfo"
          @click="toDetail(item.mid)"
        >
          <img :src="$nodeurl + item.cover" alt="" class="movImg" />
          <p class="movName">{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper"; // 引入Swiper轮播器
// 引入接口
import { hot, top, _new, commend } from "../utils/axios";

export default {
  data() {
    return {
      bannerList: [],
      movList: [],
    };
  },
  methods: {
    toDetail(mid) {
      this.$router.push("/details?mid=" + mid);
    },
  },
  mounted() {
    // 分析路由参数
    let type = this.$route.path.split("").splice(1).join("");
    // 判断请求参数，请求符合条件的接口
    if (type == "hot") {
      hot().then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.result);
          this.bannerList = res.data.result.bannerList;
          this.movList = res.data.result.list;
        }
      });
    } else if (type == "new") {
      _new().then((res) => {
        if (res.data.code == 200) {
          this.bannerList = res.data.result.bannerList;
          this.movList = res.data.result.list;
        }
      });
    } else if (type == "top") {
      top().then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.result);
          this.bannerList = res.data.result.bannerList;
          this.movList = res.data.result.list;
        }
      });
    } else if (type == "commend") {
      commend().then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.result);
          this.bannerList = res.data.result.bannerList;
          this.movList = res.data.result.list;
        }
      });
    }
  },
  updated() {
    new Swiper(".swiper-container", {
      autoplay: {
        delay: 3000,
      },
      slidesPerView: 3,
      spaceBetween: 30,
      centeredSlides: true,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  },
};
</script>

<style lang='' scoped>
.con {
  width: 1200px;
  position: absolute;
  left: 50%;
  margin-left: -600px;
}
.swiper-container {
  background-color: #f7f5f2;
  width: 100%;
  height: 500px;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  transition: 300ms;
  transform: scale(0.8);
}
.swiper-slide-active,
.swiper-slide-duplicate-active {
  transform: scale(1);
}
/* 轮播图尺寸 */
.bannerImg {
  width: 100%;
  height: 100%;
}
.movTitle {
  margin-top: 50px;
  font-size: 30px;
  color: #90959c;
}
.movList {
  margin-top: 30px;
  margin-left: 50px;
}

.movInfo {
  float: left;
  width: 200px;
  margin-right: 30px;
  text-align: center;
  margin-bottom: 50px;
  cursor: pointer;
}
.movImg {
  width: 100%;
  height: 300px;
}
.movName {
  font-size: 18px;
  line-height: 50px;
}
.rank {
  margin-left: 10px;
  font-size: 20px;
  color: #333;
}
.rank span {
  color: rgb(158, 27, 9);
  cursor: pointer;
}
</style>