<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="活动名称">
        <el-input v-model="form.mov_name"></el-input>
      </el-form-item>
      <el-form-item label="活动形式"> <div id="details"></div> </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入富文本编辑器
import E from "wangeditor";
// 引入接口
import { adddetails } from "../utils/axios";
export default {
  data() {
    return {
      editor: null, // 富文本编辑器变量
      form: {
        mov_name: "",
        details: "",
      },
    };
  },
  methods: {
    onSubmit() {
      this.form.details = this.editor.txt.html(); // 获取富文本编辑器中的内容
      adddetails(this.form).then((res) => {
        console.log(res.data, "这是接口返回的结果");
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
      console.log(this.form, "这是表单数据");
      this.reset(); // 重置输入框
    },
    reset() {
      this.form = {
        mov_name: "",
        details: "",
      };
      this.editor.txt.clear();
    },
  },
  mounted() {
    this.editor = new E("#details");
    this.editor.config.zIndex = 1;
    this.editor.create();
  },
};
</script>

<style lang='' scoped>
.el-form {
  width: 800px;
  margin: 50px;
}
</style>