<template>
  <div>
    <el-dialog
      title="发消息"
      :visible.sync="sendDialog.isShow"
      width="50%"
      center
      :close-on-click-modal="false"
      :before-close="cancel"
    >
      <div class="msg_con" ref="msgcontainer">
        <ul v-if="msgList.length > 0">
          <li
            v-for="(item, idx) in msgList"
            :key="idx"
            :class="{ my: item.c_send.sid == userInfo.sid }"
          >
            <!-- <p>{{ item.c_send.sid }}</p> -->
            <img :src="$nodeurl + item.c_send.icon" alt="" class="msgIcon" />
            <div>
              <p class="sendInfo">{{ item.c_send.nickname }} {{ item.c_time }}</p>
              <p class="msgCon">{{ item.c_content }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-input
          type="textarea"
          placeholder="请输入内容(限长50个字符)"
          v-model="textarea"
          maxlength="50"
          show-word-limit
        >
        </el-input>
        <el-button type="danger" @click="clear">清 空</el-button>
        <el-button type="primary" @click="send">发 送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sendMsg, getMsgList, msgPrompt } from "../utils/axios";
export default {
  data() {
    return {
      userInfo: {
        sid: "",
      },
      icon: require("../assets/images/usericon/user1.jpeg"),
      textarea: "",
      msgList: [],
    };
  },
  props: ["sendDialog", "sendMsgId"],
  methods: {
    // 发送
    send() {
      let data = {
        sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
        f_sid: this.sendMsgId,
        content: this.textarea,
      };
      this.textarea = "";
      sendMsg(data).then((res) => {
        console.log(res.data);
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          // 发送成功之后再次调取消息列表实现实时渲染
          this.getList(this.sendMsgId);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    clear() {
      this.textarea = "";
      console.log("清空");
    },
    // 关闭
    cancel() {
      this.sendDialog.isShow = false;
    },
    getList(f_sid) {
      let data = {
        sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
        f_sid,
      };
      getMsgList(data).then((res) => {
        if (res.data.code == 200) {
          this.msgList = res.data.result;
          console.log(this.msgList, "this.msgList");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
  mounted() {
    if (sessionStorage.getItem("userInfo")) {
      this.userInfo.sid = JSON.parse(sessionStorage.getItem("userInfo")).sid;
    }
  },
};
</script>

<style lang='' scoped>
.msg_con {
  width: 100%;
  height: 500px;
  border: 3px solid rgba(73, 59, 59, 0.397);
  overflow-y: auto;
}
ul li {
  display: flex;
  padding: 15px 30px 0px 15px;
}
.msgIcon {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
ul li div {
  flex: 1;
  background-color: rgba(216, 70, 70, 0.158);
  border-radius: 10px;
  padding: 0px 15px 15px 15px;
  margin-left: 10px;
}
ul li .sendInfo {
  margin-top: 5px;
  line-height: 30px;
  font-weight: bolder;
  font-size: 16px;
}
ul li .msgCon {
  color: orangered;
  font-size: 14px;
  margin-top: 10px;
}
ul .my {
  flex-direction: row-reverse;
}
ul .my div {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: 10px;
  text-align: right;
}
ul .my .sendInfo {
  text-align: right;
}
.el-textarea {
  font-size: 16px;
  margin-top: -30px;
}
.el-button {
  margin-top: 10px;
}
</style>