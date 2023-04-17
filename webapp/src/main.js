// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局重置样式
import "./assets/css/reset.css"

// 引入element-ui
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI); // 使用element-ui

// 引入swiper的css和js文件
import "swiper/css/swiper.css"
import "swiper/js/swiper.js"

Vue.prototype.$url = "http://localhost:8080/#/"
Vue.prototype.$nodeurl = "http://localhost:3000"

Vue.config.productionTip = false

// 添加全局事件监控userInfo方法
Vue.prototype.$resetSetItem = function (key, newVal) {
  if (key === 'userInfo') {

    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
}
// 添加全局事件监控prompt方法
Vue.prototype.$resetSetItemT = function (key, newVal) {
  if (key === 'prompt') {

    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItemT', false, false, k, null, val, null, null);

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
}


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
