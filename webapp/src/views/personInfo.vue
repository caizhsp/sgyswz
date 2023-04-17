<template>
  <div class="mine">
    <!-- 头像 -->
    <div class="mine-icon">
      <div class="demo-fit">
        <div class="block">
          <el-avatar
            shape="square"
            :size="150"
            :src="
              userInfo.icon
                ? $nodeurl + userInfo.icon
                : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
            "
          ></el-avatar>
          <p class="nickname">{{ userInfo.nickname }}</p>
          <p class="sex-birthday">
            {{ userInfo.sex == 0 ? "男" : "女" }} {{ userInfo.createtime }}
          </p>
          <p class="area">{{ userInfo.area }}</p>
          <p class="area">SID:{{ userInfo.sid }}</p>
          <el-button
            v-if="showBtns.isEdit"
            type="primary"
            plain
            icon="el-icon-edit"
            size="small"
            class="intro-edit-btn"
            @click="editInfo"
            >编辑资料</el-button
          >
          <el-button
            v-if="addFlag"
            type="primary"
            plain
            icon="el-icon-circle-plus-outline"
            size="small"
            class="intro-edit-btn"
            style="margin-left: 0px"
            @click="addFriend"
            >加为好友</el-button
          >
        </div>
      </div>
    </div>
    <!-- 编辑资料对话框 -->
    <el-dialog
      title="编辑我的资料"
      :visible.sync="editDialog.isShow"
      class="edit-dialog"
      width="27%"
    >
      <el-form :model="mineInfo">
        <!-- 头像上传 -->
        <!-- <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :multiple="false"
            :auto-upload="false"
            :limit="1"
            :on-change="iconChange"
            :file-list="iconList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogImgVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item> -->

        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input
            v-model="mineInfo.name"
            autocomplete="off"
            class="nickname-input"
            style="width: 220px"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select v-model="mineInfo.sex" placeholder="请选择性别">
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">
          <div class="block">
            <el-date-picker
              v-model="birthday"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="地区" :label-width="formLabelWidth">
          <div class="block">
            <el-cascader
              v-model="area"
              :options="areaOptions"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer edit-dialog-footer">
        <el-button @click="editDialog.isShow = false">取 消</el-button>
        <el-button type="primary" @click="editInfoOk">确 定</el-button>
      </div>
    </el-dialog>

    <div class="introduce">
      <div class="piece">
        <!-- 个人介绍 -->
        <h3 style="font-size: 24px; color: grey" class="intro-titile">
          个人介绍
        </h3>
        <!-- 如果没有介绍，则为此条默认介绍 -->
        <h3
          class="intro-con"
          style="font-weight: normal; text-indent: 1em; width: 700px"
        >
          {{
            userInfo.remark
              ? userInfo.remark
              : "这个人很神秘，什么也没有留下......"
          }}
        </h3>
        <!-- 照片墙 -->
        <!-- <h3 style="font-size: 24px; color: grey" class="intro-titile">
          照片墙
        </h3>
        <div class="intro-con" style="width: 700px">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="item.url"
              :preview-src-list="item.srcList"
              class="pre-img"
              v-for="(item, idx) in images"
              :key="idx"
            >
            </el-image>
            <el-image
              style="width: 100px; height: 100px"
              :src="moreurl"
            ></el-image>
          </div>
        </div> -->
        <!-- 创建的讨论组 -->
        <!-- <h3 style="font-size: 24px; color: grey" class="intro-titile">
          我创建的讨论组
        </h3> -->
        <!-- <div class="collect" style="width: 700px">
          <div class="intro-con stars" v-for="item in groups" :key="item.name">
            <a href="#"
              ><el-image
                style="width: 100px; height: 100px"
                :src="item.icon"
                class="stars-img"
              ></el-image>
              <p
                style="font-size: 14px; line-height: 20px; font-weight: bold"
                class="stars-title"
              >
                {{ item.name }}
              </p></a
            >
          </div>
          <div class="intro-con stars">
            <a href="#">
              <el-image
                style="width: 100px; height: 100px"
                :src="addurl"
                class="stars-img"
              ></el-image>
              <p
                style="font-size: 14px; line-height: 20px; font-weight: bold"
                class="stars-title"
              >
                创建新分组
              </p>
            </a>
          </div>
        </div> -->
        <!-- 我的好友 -->
        <h3
          style="font-size: 24px; color: grey; clear: both; padding-top: 20px"
          class="intro-titile"
        >
          我的好友
        </h3>
        <ul v-if="friendsList.length > 0" class="f_ul">
          <li
            v-for="item in friendsList"
            :key="item.sid"
            class="f_li"
            @click="toFriend(item.sid)"
          >
            <img :src="$nodeurl + item.icon" alt="" class="f_icon" />
            <div>
              <p class="f_nickname">
                {{ item.nickname }}
                <span class="msgPrompt" v-if="prompt > 0">新消息</span>
              </p>
              <p class="f_sid">SID:{{ item.sid }}</p>
            </div>
            <div
              style="margin-left: 10px; margin-top: 20px"
              v-if="editFriendShow"
            >
              <p style="margin-bottom: 10px">
                <el-button type="primary" @click.stop="sendMsg(item.sid)"
                  >发消息</el-button
                >
              </p>
              <p>
                <el-button type="danger" @click.stop="delFriend(item.sid)"
                  >删&nbsp;&nbsp;&nbsp;&nbsp;除</el-button
                >
              </p>
            </div>
          </li>
        </ul>
        <!-- 无好友 -->
        <p v-else class="intro-con">还没有好友呢，快去添加好友吧......</p>

        <!-- 我的影评 -->
        <h3 style="font-size: 24px; color: grey" class="intro-titile">
          我的影评
        </h3>
        <h4 style="font-size: 20px">短评</h4>
        <div v-if="shortItem.length > 0">
          <div class="short-item" v-for="item in shortItem" :key="item.content">
            <div class="short-item-con" v-html="item.content"></div>
            <div class="mov-name">
              <p class="short-item-name">
                ------来自影视&laquo;<span
                  @click="todetails(item.mid)"
                  class="todetails"
                  >{{ item.name }}</span
                >&raquo;&nbsp;&nbsp;&nbsp;{{ item.com_time }}
              </p>
            </div>
            <div v-if="showBtns.delComBtn">
              <el-button type="danger" size="mini" @click="delCom(item)"
                >删除评论</el-button
              >
            </div>
          </div>
          <p style="width: 700px; text-align: right">
            <span
              style="color: #f56f83; cursor: pointer"
              @click="mydetails('short')"
              >全部短评>>></span
            >
          </p>
        </div>
        <div v-else>
          <h2 style="color: orange; text-align: center">
            暂无评论，快去添加评论吧
          </h2>
        </div>
        <h4 style="font-size: 20px">长评</h4>
        <div class="" v-if="longItem.length > 0">
          <div class="short-item" v-for="item in longItem" :key="item.content">
            <div class="short-item-con" v-html="item.content"></div>
            <div class="mov-name">
              <p class="short-item-name">
                ------来自影视&laquo;<span
                  @click="todetails(item.mid)"
                  class="todetails"
                  >{{ item.name }}</span
                >&raquo;&nbsp;&nbsp;&nbsp;{{ item.com_time }}
              </p>
            </div>
            <div v-if="showBtns.delComBtn">
              <el-button type="danger" size="mini" @click="delCom(item)"
                >删除评论</el-button
              >
            </div>
          </div>
          <p style="width: 700px; text-align: right">
            <span
              style="color: #f56f83; cursor: pointer"
              @click="mydetails('long')"
              >全部长评>>></span
            >
          </p>
        </div>
        <div v-else>
          <h2 style="color: orange; text-align: center">
            暂无评论，快去添加评论吧
          </h2>
        </div>

        <!-- 个人收藏夹 -->
        <h3 style="font-size: 24px; color: grey" class="intro-titile">
          个人收藏夹
        </h3>
        <div class="collect" style="width: 750px">
          <div
            class="intro-con stars"
            v-for="item in collections"
            :key="item.mid"
          >
            <a :href="'http://localhost:8080/#/details?mid=' + item.mid"
              ><el-image
                style="width: 100px; height: 100px"
                :src="$nodeurl + item.mini_icon"
                class="stars-img"
              ></el-image>
              <p style="font-size: 12px; line-height: 16px" class="stars-title">
                {{ item.name }}
              </p>
            </a>
            <el-button
              v-if="showBtns.removeColBtn"
              icon="el-icon-circle-close"
              size="mini"
              plain
              @click="removeCollect(item.mid)"
              >移除</el-button
            >
          </div>
          <a href="#">
            <el-image
              style="width: 100px; height: 100px"
              :src="moreurl"
              class="stars-img"
            ></el-image>
          </a>
        </div>

        <!-- 个人日志 -->
        <!-- <h3
          style="font-size: 24px; color: grey; margin-top: 80px"
          class="intro-titile"
        >
          我的日志
        </h3> -->
        <!-- 如果没有介绍，则为此条默认介绍 -->
        <!-- <p class="intro-con">这个人很神秘，什么也没有留下......</p> -->
      </div>
    </div>
    <!-- 发送消息框 -->
    <send-msg-dialog
      :sendDialog="sendDialog"
      :sendMsgId="sendMsgId"
      ref="sendDialog"
    ></send-msg-dialog>
  </div>
</template>

<script>
import sendMsgDialog from "../components/sendMsgDialog.vue";
import {
  getMyCom,
  delMyCom,
  edit,
  getMyCollects,
  movcollect,
  getUserInfo,
  addFriend,
  delFriend,
  read,
} from "../utils/axios";

export default {
  data() {
    return {
      prompt: "",
      sendMsgId: "",
      sendDialog: {
        isShow: false,
      },
      editFriendShow: false,
      friendsList: [],
      addFlag: true,
      addInfoShow: false,
      showBtns: {
        addFriendBtn: false,
        editBtn: false,
        delComBtn: false,
        removeColBtn: false,
      },
      userInfo: [],
      // dialogImageUrl: "",
      // dialogImgVisible: false,
      // iconList: [],
      area: [],
      areaOptions: [
        {
          value: "北京市",
          label: "北京市",
          children: [
            {
              value: "和平区",
              label: "和平区",
            },
            {
              value: "河东区",
              label: "河东区",
            },
            {
              value: "河西区",
              label: "河西区",
            },
            {
              value: "南开区",
              label: "南开区",
            },
            {
              value: "河北区",
              label: "河北区",
            },
            {
              value: "红桥区",
              label: "红桥区",
            },
            {
              value: "朝阳区",
              label: "朝阳区",
            },
          ],
        },
        {
          value: "河南省",
          label: "河南省",
          children: [
            {
              value: "郑州市",
              label: "郑州市",
              children: [
                {
                  value: "新郑市",
                  label: "新郑市",
                },
                {
                  value: "中牟市",
                  label: "中牟市",
                },
                {
                  value: "中原区",
                  label: "中原区",
                },
                {
                  value: "二七区",
                  label: "二七区",
                },
                {
                  value: "金水区",
                  label: "金水区",
                },
                {
                  value: "惠济区",
                  label: "惠济区",
                },
                {
                  value: "上街区",
                  label: "上街区",
                },
              ],
            },
            {
              value: "开封市",
              label: "开封市",
              children: [
                {
                  value: "尉氏县",
                  label: "尉氏县",
                },
                {
                  value: "兰考县",
                  label: "兰考县",
                },
                {
                  value: "杞县",
                  label: "杞县",
                },
                {
                  value: "通许县",
                  label: "通许县",
                },
                {
                  value: "鼓楼区",
                  label: "鼓楼区",
                },
                {
                  value: "龙亭区",
                  label: "龙亭区",
                },
              ],
            },
          ],
        },
      ],
      birthday: "",
      editDialog: {
        isShow: false,
      },
      mineInfo: {
        name: "",
        sex: "",
      },
      formLabelWidth: "120px",
      shortItem: [],
      longItem: [],
      images: [
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          srcList: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
          ],
        },
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          srcList: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
          ],
        },
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          srcList: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
          ],
        },
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          srcList: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
          ],
        },
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          srcList: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
          ],
        },
      ],
      moreurl: require("../assets/images/more1.png"),
      addurl: require("../assets/images/add.png"),
      collections: [],
      groups: [
        {
          name: "相亲相爱一家人",
          icon: require("../assets/images/collection/c1.webp"),
        },
        {
          name: "相亲相爱两家人",
          icon: require("../assets/images/collection/c1.webp"),
        },
        {
          name: "相亲相爱三家人",
          icon: require("../assets/images/collection/c1.webp"),
        },
        {
          name: "相亲相爱五家人",
          icon: require("../assets/images/collection/c1.webp"),
        },
        {
          name: "相亲相爱6家人",
          icon: require("../assets/images/collection/c1.webp"),
        },
      ],
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        // 监听路由参数变化，实现路由页面刷新
        this.$router.replace("/refresh");
      },
    },
  },
  components: {
    sendMsgDialog,
  },
  mounted() {
    // 监听缓存变化
    window.addEventListener("setItem", () => {
      let info = JSON.parse(sessionStorage.getItem("userInfo"));
      this.friendsList = info.friends;
    });

    // 如果路由中有sid，没有的话说明是进入个人中心
    if (!this.$route.query.sid) {
      console.log("无sid");
      // 获取sessionStorage中存储的个人信息
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

      this.showBtns = {
        isEdit: true,
        delComBtn: true,
        removeColBtn: true,
      };
      // 隐藏加好友按钮
      this.addFlag = false;
      // 显示好友操作按钮
      this.editFriendShow = true;

      this.friendsList = this.userInfo.friends;
      console.log(this.friendsList,"this.friendsList");

      this.prompt = sessionStorage.getItem("prompt");

      // 获取个人评论
      getMyCom({ sid: this.userInfo.sid }).then((res) => {
        if (res.data.code == 200) {
          this.shortItem = res.data.result.short;
          this.longItem = res.data.result.long;
        }
      });
      // 获取个人收藏
      getMyCollects({ sid: this.userInfo.sid }).then((res) => {
        if (res.data.code == 200) {
          this.collections = res.data.result;
        }
      });
    } else {
      console.log("有sid");
      // 有的话说明是查看其他人资料
      this.showBtns = {
        isEdit: false,
        delComBtn: false,
        removeColBtn: false,
      };
      // 从路由中获取sid并获取数据
      let sid = this.$route.query.sid;

      if (sessionStorage.getItem("userInfo")) {
        // 获取好友数组，并判断此页面是否为好友
        this.addFlag = !JSON.parse(
          sessionStorage.getItem("userInfo")
        ).friends.some((item) => {
          return item.sid == sid;
        });
        // 如果是sid == 当前登录人的sid，则进入个人中心
        if (JSON.parse(sessionStorage.getItem("userInfo")).sid == sid) {
          this.addFlag = false;
          this.showBtns = {
            isEdit: true,
            delComBtn: true,
            removeColBtn: true,
          };
          this.editFriendShow = true;
          this.prompt = sessionStorage.getItem("prompt");
        }
      }
      // 调取个人信息接口，获取对应的个人信息
      getUserInfo({ sid }).then((res) => {
        // console.log(res.data.result, "调取接口错误");
        if (res.data.code == 200) {
          // console.log(res.data.result, "其他人个人信息结果");
          let info = res.data.result;
          this.userInfo = res.data.result;

          // 获取好友列表
          this.friendsList = this.userInfo.friends;

          // 获取个人评论
          getMyCom({ sid: info.sid }).then((res) => {
            if (res.data.code == 200) {
              // console.log(res.data.result, "res");
              this.shortItem = res.data.result.short;
              this.longItem = res.data.result.long;
            }
          });

          // 获取个人收藏
          getMyCollects({ sid: info.sid }).then((res) => {
            if (res.data.code == 200) {
              this.collections = res.data.result;
            }
          });
        }
      });
    }
  },
  methods: {
    // 发送消息
    sendMsg(f_sid) {
      /**
       * sid(发送人) f_sid(接收人) content(消息内容)
       */
      this.sendDialog = {
        isShow: true,
      };
      this.sendMsgId = f_sid;
      this.$refs.sendDialog.getList(f_sid);
      read({
        sid: this.userInfo.sid,
        f_sid,
      }).then((res) => {
        if (res.data.code == 200) {
          // 接口请求成功之后，将消息未读数设置为0
          this.$resetSetItemT("prompt", 0);
          this.prompt = 0;
        }
      });
    },
    // 删除好友
    delFriend(f_sid) {
      this.$confirm("确认删除此好友, 是否继续?", "好友操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {
            sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
            f_sid,
          };
          delFriend(data).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              // 更新完删除好友列表，并将删除后的数据存入到缓存中
              let arr = this.friendsList.map((item) => {
                return item.sid;
              });
              this.friendsList.splice(arr.indexOf(res.data.result[0]), 1);
              // 取出缓存中的数据更新并重新存入
              this.userInfo.friends = this.friendsList;
              sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 进入好友页面
    toFriend(sid) {
      this.$router.push(`/personInfo?sid=${sid}`);
    },
    // 加好友
    addFriend() {
      if (!sessionStorage.getItem("userInfo")) {
        this.$confirm("你还未登录，现在要去登录吗？", "提示", {
          confirmButtonText: "登录",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 如果确认登录，则将本页的历史记录存入缓存中，方便回退
            sessionStorage.setItem("history", this.$route.fullPath);
            this.$router.push("/login");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消登录",
            });
          });
      } else {
        this.$confirm("你确定要添加此用户为好友吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // 获取当前已登录人的sid和请求添加好友的sid(f_sid)
            let data = {
              sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
              f_sid: this.$route.query.sid,
            };
            addFriend(data).then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "已发送请求",
                });
              } else {
                this.$message.error(res.data.msg);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消添加",
            });
          });
      }
    },
    // 移除收藏
    removeCollect(mid) {
      movcollect({
        sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
        mid,
      }).then((res) => {
        this.$message.success(res.data.msg);
        sessionStorage.setItem("userInfo", JSON.stringify(res.data.result));
        // 重新获取个人收藏
        getMyCollects({ sid: this.userInfo.sid }).then((res) => {
          if (res.data.code == 200) {
            this.collections = res.data.result;
          }
        });
      });
    },
    // 删除评论
    delCom(e) {
      this.$confirm("此操作将永久删除本条评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delMyCom(e.com_id).then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
              // 删除成功后重新获取个人评论
              getMyCom({ sid: this.userInfo.sid }).then((res) => {
                if (res.data.code == 200) {
                  // console.log(res.data.result, "res");
                  this.shortItem = res.data.result.short;
                  this.longItem = res.data.result.long;
                }
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击评论中的影视名跳转事件
    todetails(mid) {
      this.$router.push("/details?mid=" + mid);
    },
    // 全部评论
    mydetails(e) {
      e == "short" ? (e = 1) : (e = 2);
      console.log(e);
      if (!sessionStorage.getItem("userInfo")) {
        this.$router.push(
          "/minecomment?short=" +
            e +
            "&size=all" +
            "&sid=" +
            this.$route.query.sid
        );
      } else {
        this.$router.push("/minecomment?short=" + e + "&size=all");
      }
    },
    // 地区改变事件
    handleChange(value) {
      // console.log(value);
    },
    // 头像移出钩子函数
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 头像预览时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(this.dialogImageUrl);
    },
    // 头像变化时触发的函数
    iconChange(file, fileList) {
      // console.log(file, fileList);
      this.iconList = file.raw;
    },
    // 编辑资料按钮事件
    editInfo() {
      this.editDialog = {
        isShow: true,
      };
      /**
       *  icon name  sex  birthday  area
       */
      // 取出缓存中的个人信息
      let mineInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      // console.log(mineInfo);
      this.mineInfo = {
        name: mineInfo.nickname,
        sex: mineInfo.sex,
      };
      this.area = mineInfo.area.split("/");
      this.birthday = mineInfo.birthday;
    },
    // 确认资料修改事件
    editInfoOk() {
      // 对地区做处理
      let area = this.area.join("/");
      let info = {
        sid: JSON.parse(sessionStorage.getItem("userInfo")).sid,
        nickname: this.mineInfo.name,
        sex: this.mineInfo.sex,
        birthday: this.birthday,
        area,
      };
      edit(info).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: "编辑成功",
            type: "success",
          });
          this.close(); // 关闭对话框并清空其内容
          this.$resetSetItem("userInfo", JSON.stringify(res.data.result));
          sessionStorage.setItem("userInfo", JSON.stringify(res.data.result)); // 将缓存中的用户数据进行更新
          this.userInfo = res.data.result; // 将数据获取赋值给变量，实现实时渲染
        } else {
          this.$message.error("出错了，请稍后重试");
        }
      });
    }, // 关闭清空事件
    close() {
      this.editDialog = {
        isShow: false,
      };

      // birthday: this.birthday,
      // area,
      this.mineInfo = {
        name: "",
        sex: "",
      };
      this.birthday = "";
      this.area = [];
    },
  },
};
</script>

<style lang='' scoped>
.mine {
  width: 1200px;
  position: absolute;
  left: 15%;
  top: 10%;
}
/* 昵称 */
.mine-icon {
  width: 150px;
  position: absolute;
  margin-right: 30px;
  text-align: center;
}

.nickname,
.sex-birthday,
.area {
  color: #333;
  font-size: 20px;
  line-height: 40px;
  font-weight: bold;
}
.sex-birthday {
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  color: rgb(0, 104, 69);
}
.area {
  font-size: 14px;
  line-height: 20px;
  font-weight: normal;
  color: rgb(0, 104, 69);
}

.intro-edit-btn {
  text-align: center;
  margin-top: 10px;
}
/* 个人介绍 */
.introduce {
  position: absolute;
  color: #333;
  width: 300px;
  line-height: 40px;
  color: rgb(68, 54, 54);
  left: 15%;
  margin-bottom: 150px;
  padding-bottom: 150px;
}
.intro-titile {
  margin-top: 50px;
}
/* 短评容器 */
.short-item {
  width: 700px;
  /* height: 50px; */
  margin: 10px 8px;
  padding: 15px 8px;
  border-bottom: 1px solid #333;
  /* background-color: red; */
}
.short-item-con {
  font-size: 16px;
  line-height: 20px;
}
.mov-name {
  height: 20px;
}
.short-item-name {
  float: right;
  font-size: 14px;
  color: rgb(141, 132, 132);
}
/* 缩略图 */
.el-image {
  margin-top: 10px;
  margin-right: 10px;
}
.el-image >>> .el-image__preview {
  float: left;
}
/* 收藏夹 */
.stars {
  width: 100px;
  float: left;
  text-align: center;
  /* background-color: skyblue; */
  margin-right: 10px;
}
.stars a {
  color: #333;
}
/* 讨论组按钮 */
.group-btn {
  background-color: transparent;
  border: 2px solid rgb(235, 132, 132);
  color: rgb(201, 25, 142);
  font-size: 16px;
}
/* 编辑资料对话框 */
.edit-dialog >>> .el-dialog__header {
  text-align: center;
}
.edit-dialog-footer {
  text-align: center;
}

.todetails {
  cursor: pointer;
}
.todetails:hover {
  color: red;
}
.f_ul {
  margin-top: 10px;
}

.f_ul .f_li {
  width: 700px;
  display: flex;
  padding: 10px;
  cursor: pointer;
}

.f_icon {
  width: 120px;
  height: 120px;
  margin-right: 20px;
}
.f_ul .f_li div p {
  font-size: 14px;
}
.f_ul .f_li div .f_nickname {
  font-size: 20px;
  font-weight: bolder;
  color: rgb(28, 117, 98);
  line-height: 80px;
}
.f_ul .f_li div .f_sid {
  font-weight: bolder;
}
.msgPrompt {
  padding: 2px 5px;
  font-size: 14px;
  color: white;
  font-weight: normal;
  background-color: red;
  border-radius: 3px;
}
</style>