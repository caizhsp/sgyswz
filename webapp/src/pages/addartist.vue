<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="演员id">
        <el-input v-model="form.a_id"></el-input>
      </el-form-item>
      <el-form-item label="演员名字">
        <el-input v-model="form.a_name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" @keyup.enter="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入接口
import { addartist } from "../utils/axios/index";
export default {
  data() {
    return {
      form: {
        a_id: "",
        a_name: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log(this.form, "这是表单数据");
      addartist(this.form).then((res) => {
        console.log(res.data, "这是请求的数据结果");
        this.$message({
          message: res.data.msg,
          type: 'success'
        });
      });
      this.form = {
        a_id: "",
        a_name: "",
      };
    },
  },
};
</script>

<style lang='' scoped>
.el-input {
  width: 300px;
}
.el-form {
  margin: 50px;
  width: 500px;
}
</style>