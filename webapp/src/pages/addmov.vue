<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" style="width: 700px">
      <el-form-item label="影片id">
        <el-input v-model="form.mid"></el-input>
      </el-form-item>
      <el-form-item label="影片分类">
        <el-checkbox-group v-model="form.sort">
          <el-checkbox label="喜剧" name="type"></el-checkbox>
          <el-checkbox label="悲剧" name="type"></el-checkbox>
          <el-checkbox label="科幻" name="type"></el-checkbox>
          <el-checkbox label="爱情" name="type"></el-checkbox>
          <el-checkbox label="话剧" name="type"></el-checkbox>
          <el-checkbox label="动画" name="type"></el-checkbox>
          <el-checkbox label="战争" name="type"></el-checkbox>
          <el-checkbox label="剧情" name="type"></el-checkbox>
          <el-checkbox label="悬疑" name="type"></el-checkbox>
          <el-checkbox label="古装" name="type"></el-checkbox>
          <el-checkbox label="动作" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="影名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="热度">
        <el-input v-model="form.hot"></el-input>
      </el-form-item>
      <el-form-item label="影片上线时间">
        <el-date-picker
          v-model="form.ontime"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        v-for="(Art, index) in dynamicValidateForm.Arts"
        :label="'演员' + index"
        :key="Art.key"
      >
        <el-input v-model="Art.value"></el-input
        ><el-button @click.prevent="removeArt(Art)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addArt">添加演员</el-button>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in bianjuForm.bianju"
        :label="'编剧' + index"
        :key="item.key"
      >
        <el-input v-model="item.value"></el-input
        ><el-button @click.prevent="removeBianju(item)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addBianju">添加编剧</el-button>
      </el-form-item>
      <el-form-item label="导演">
        <el-input v-model="form.director"></el-input>
      </el-form-item>
      <!-- <el-form-item label="影片封面">
        <el-upload
          action="#"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="coverUpload"
          :auto-upload="false"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="影片mini封面">
        <el-upload
          action="#"
          list-type="picture-card"
          :on-preview="minihandlePictureCardPreview"
          :on-remove="minihandleRemove"
          :on-change="miniiconUpload"
          :auto-upload="false"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="minidialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入接口
import { addmov } from "../utils/axios";
export default {
  data() {
    return {
      form: {
        mid: "",
        hot: "",
        name: "",
        ontime: "",
        artist: "",
        bianju: "",
        director: "",
        cover: "",
        sort: [],
        miniicon: "",
      },

      dynamicValidateForm: {
        Arts: [
          {
            value: "",
          },
        ],
        email: "",
      },
      bianjuForm: {
        bianju: [
          {
            value: "",
          },
        ],
      },
      dialogImageUrl: "", // 大图路径
      dialogVisible: false, // 大图可见
      minidialogImageUrl: "", // 小图路径
      minidialogVisible: false, // 小图可见
    };
  },
  methods: {
    // mini封面文件上传时的钩子
    miniiconUpload(file, fileList) {
      this.form.miniicon = file.url;
    },
    // 移出mini图图片钩子函数
    minihandleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 预览mini图图片钩子函数
    minihandlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.form.miniicon = file.url;
      console.log(this.form.miniicon, "this.form.miniicon");
      this.dialogVisible = true;
    },
    // 大封面文件上传时的钩子
    coverUpload(file, fileList) {
      this.form.cover = file.url;
    },
    // 移出大图图片钩子函数
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 预览大图图片钩子函数
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.form.cover = file.url;
      console.log(this.form.cover, "this.form.cover");
      this.dialogVisible = true;
    },
    onSubmit() {
      // 转换演员格式
      var artists = [];
      this.dynamicValidateForm.Arts.map((item) => {
        artists.push(item.value);
      });

      // 转换编剧格式
      var bianjus = [];
      this.bianjuForm.bianju.map((item) => {
        bianjus.push(item.value);
      });

      this.form.artist = artists.join(","); // 将演员转换为规定格式传递
      this.form.bianju = bianjus.join(","); // 将编剧转换为规定格式传递
      this.form.sort = this.form.sort.join(","); // 将分类转换为规定格式传递
      this.form.ontime = new Date(this.form.ontime).getTime(); // 将时间转换为时间戳
      this.form.cover = `/static/images/cover/${this.form.mid}.webp`;
      this,
        (this.form.miniicon = `/static/images/miniicon/${this.form.mid}.webp`);
      console.log(this.form, "this.form");

      addmov(this.form).then((res) => {
        console.log(res.data, "这是结果");
        alert(res.data.msg);
      });

      //   添加完成之后清空输入框
      this.form = {
        mid: "",
        name: "",
        ontime: "",
        artist: "",
        bianju: "",
        director: "",
        sort: [],
        cover: "",
        miniicon: "",
      };
      this.dynamicValidateForm = {
        Arts: [
          {
            value: "",
          },
        ],
      };
      this.bianjuForm = {
        bianju: [
          {
            value: "",
          },
        ],
      };
    },
    // 添加演员输入框
    addArt() {
      this.dynamicValidateForm.Arts.push({
        value: "",
        key: Date.now(),
      });
    },
    // 删除演员输入框
    removeArt(item) {
      var index = this.dynamicValidateForm.Arts.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.Arts.splice(index, 1);
      }
    },
    // 添加编剧输入框
    addBianju() {
      this.bianjuForm.bianju.push({
        value: "",
        key: Date.now(),
      });
    },
    // 删除编剧输入框
    removeBianju(item) {
      var index = this.bianjuForm.bianju.indexOf(item);
      if (index !== -1) {
        this.bianjuForm.bianju.splice(index, 1);
      }
    },
  },
};
</script>

<style lang='' scoped>
.el-input {
  width: 300px;
}
</style>