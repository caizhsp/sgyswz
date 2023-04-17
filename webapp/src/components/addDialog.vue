<template>
  <div>
    <el-dialog
      title="好友申请"
      :visible.sync="addList.isShow"
      width="50%"
      :before-close="cancel"
      :close-on-click-modal="false"
    >
      <ul v-if="addMsg.length > 0">
        <li
          v-for="(item, index) in addMsg"
          :key="item.sid"
          @click="lookUser(item.sid)"
        >
          <img :src="$nodeurl + item.icon" alt="" class="icon" />
          <p>
            <span style="color: orange">{{ item.nickname }}</span>
            &nbsp;&nbsp;SID:<span style="color: orange">{{ item.sid }}</span>
            &nbsp;&nbsp;
            <span style="color: red">{{ item.sex == 0 ? "男" : "女" }}</span>
          </p>
          <el-button @click.stop="agree(item.sid, index)" type="primary"
            >同意</el-button
          >
          <el-button type="danger" @click.stop="refuse(item.sid, index)"
            >拒绝</el-button
          >
        </li>
      </ul>
      <h2 style="text-align: center" v-else>暂时没有还有申请哟</h2>
    </el-dialog>
  </div>
</template>

<script>
import { isAgree } from "../utils/axios";
export default {
  data() {
    return {
      icon: require("../assets/images/usericon/user1.jpeg"),
      addMsg: [],
    };
  },
  props: ["addList"],
  methods: {
    // 查看用户资料
    lookUser(sid) {
      this.cancel();
      // console.log(sid, "点击了");
      this.$router.push("/personInfo?sid=" + sid);
    },
    // 同意
    agree(f_sid, index) {
      let data = {
        sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
        f_sid,
        isAdd: true,
      };
      isAgree(data).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          let data =  this.remove(index); // 调用方法
          let info = JSON.parse(sessionStorage.getItem("userInfo"))
          info.friends.push(data)
          this.$resetSetItem("userInfo", JSON.stringify(info)); // 将缓存同步到会话存储中
          this.addMsg = info.addMsg; // 重新获取缓存中的值
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 拒绝
    refuse(f_sid, index) {
      let data = {
        sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
        f_sid,
        isAdd: false,
      };
      isAgree(data).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          this.remove(index);
          this.addMsg = JSON.parse(sessionStorage.getItem("userInfo")).addMsg;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取消
    cancel() {
      this.addList.isShow = false;
    },
    // 移除已操作的申请
    remove(i) {
      let list = JSON.parse(sessionStorage.getItem("userInfo")).addMsg;
      let data = list.splice(i, 1);
      // 更改缓存中的值
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      userInfo.addMsg = list;
      this.$resetSetItem("userInfo", JSON.stringify(userInfo)); // 同步sessionStorage
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      return data[0];
    },
  },
  mounted() {
    this.addMsg = JSON.parse(sessionStorage.getItem("userInfo")).addMsg;
  },
};
</script>

<style lang='' scoped>
ul li {
  display: flex;
  border: 1px solid red;
  padding: 5px;
  cursor: pointer;
}
.icon {
  height: 80px;
}
ul li p {
  font-size: 14px;
  flex: 1;
  line-height: 80px;
  margin-left: 20px;
}
</style>