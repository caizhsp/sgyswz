<template>
  <div>
    <el-dialog
      :title="dialogInfo.isShort ? '发表短评' : '发表影评'"
      :visible.sync="dialogInfo.isShow"
      @opened="opened"
      center
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item>
          <div id="div1"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" plain @click="release">确 定</el-button>
        <el-button type="danger" plain @click="clean">清 空</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入富文本编辑器
import E from "wangeditor";
// 引入接口文件
import { commentadd } from "../utils/axios";

export default {
  data() {
    return {
      editor: null,
      content: "",
      con_text: "",
    };
  },
  props: ["dialogInfo"],
  methods: {
    // 取消事件
    cancel() {
      this.editor.destroy();
      this.dialogInfo.isShow = false;
    },
    // 发表事件
    release() {
      /**
       *  mid:隶属于哪个影片
       *  content:评论内容
       *  sid:发表评论人
       *  let { mid, content, con_text, sid } = req.body
       */
      // 判断是否登录
      if (!JSON.parse(sessionStorage.getItem("userInfo"))) {
        this.$message.error("你还未登录，请先登录");
        return;
      }

      let mid = this.$route.query.mid;
      this.content = this.editor.txt.html();
      this.con_text = this.editor.txt.text();
      let sid = JSON.parse(sessionStorage.getItem("userInfo")).sid;

      if (this.con_text == "") {
        alert("评论内容不能为空");
        return;
      }
      if (this.dialogInfo.isShort == true) {
        // console.log(this.con_text.split("").length, "评论长度");
        if (this.con_text.split("").length > 50) {
          this.$message.error("短评不能超过50个字符");
          return;
        }
      } else if (this.dialogInfo.isShort == false) {
        if (this.con_text.split("").length < 50) {
          this.$message.error("长评不能少于50个字符");
          return;
        }
      }
      let data = {
        mid,
        content: this.content,
        con_text: this.con_text,
        sid,
      };
      // console.log(data, "评论");
      commentadd(data).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
        }
      });

      this.cancel();
      // 子传父，刷新数据
      this.$emit("refresh");
    },
    // 清空事件
    clean() {
      this.editor.txt.clear();
    },
    // 对话框打开时的回调
    opened() {
      this.editor = new E("#div1");
      this.editor.config.placeholder = "请输入评论内容";
      this.editor.create();
    },
  },
  mounted() {},
};
</script>

<style lang='' scoped>
#div1 {
  margin: 0 auto;
}
</style>