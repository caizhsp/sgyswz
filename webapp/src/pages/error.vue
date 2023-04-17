<template>
  <div class="error">
    <img :src="errorurl" alt="" />
    <el-button type="primary" @click="toIndex">点击返回主页</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorurl: require("../assets/404.jpeg"),
    };
  },
  methods:{
      toIndex(){
          this.$router.push("/index")
      }
  }
};
</script>

<style lang='' scoped>
.error {
  width: 100vw;
  height: 100vh;
  background-color: #bfa;
  position: relative;
}

img {
  width: 100%;
  height: 100%;
  position: absolute;
}
.el-button{
    position: fixed;
    top: 87%;
    left: 50%;
    width: 200px;
    height: 60px;
    margin-left: -100px;
    font-size: 20px;
}
</style>