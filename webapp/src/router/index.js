import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// //解决编程式路由往同一地址跳转时会报错的情况
// const originalPush = Router.prototype.push;
// const originalReplace = Router.prototype.replace;
// //push
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject)
//     return originalPush.call(this, location, onResolve, onReject);
//   return originalPush.call(this, location).catch(err => err);
// };
// //replace
// Router.prototype.replace = function push(location, onResolve, onReject) {
//   if (onResolve || onReject)
//     return originalReplace.call(this, location, onResolve, onReject);
//   return originalReplace.call(this, location).catch(err => err);
// };

export default new Router({
  routes: [
    {
      path: "/index",
      component: () => import("../pages/index.vue"),
      children: [
        {
          path: "/search",
          component: () => import("../views/search.vue"),
        },
        {
          path: "/details",
          component: () => import("../views/details.vue")
        },
        {
          path: "/personInfo",
          component: () => import("../views/personInfo.vue")
        },
        { // 推荐
          path: "/commend",
          component: () => import("../views/commend.vue"),
          name: "推荐"
        },
        { // 热榜
          path: "/hot",
          component: () => import("../views/hot.vue"),
          name: "热榜"
        },
        { // 新榜
          path: "/new",
          component: () => import("../views/new.vue"),
          name: "热榜"
        },
        { // top榜
          path: "/top",
          component: () => import("../views/top.vue"),
          name: "热榜"
        },
        {
          path: "/sort-comedy",
          component: () => import("../views/sort//sort-comedy"),
          name: "喜剧"
        },
        {
          path: "/sort-love",
          component: () => import("../views/sort/sort-love"),
          name: "爱情"
        },
        {
          path: "/sort-drama",
          component: () => import("../views/sort/sort-drama"),
          name: "话剧"
        },
        {
          path: "/sort-science",
          component: () => import("../views/sort/sort-science"),
          name: "科幻"
        },
        {
          path: "/sort-animation",
          component: () => import("../views/sort/sort-animation"),
          name: "动画"
        },
        {
          path: "/sort-story",
          component: () => import("../views/sort/sort-story"),
          name: "剧情"
        },
        {
          path: "/sort-cliffhang",
          component: () => import("../views/sort/sort-cliffhang"),
          name: "悬疑"
        },
        {
          path: "/sort-costume",
          component: () => import("../views/sort/sort-costume"),
          name: "古装"
        },
        {
          path: "/sort-war",
          component: () => import("../views/sort/sort-war"),
          name: "战争"
        },
        {
          path: "/sort-action",
          component: () => import("../views/sort/sort-action"),
          name: "动作"
        },
        {
          path: "/searchRes",
          component: () => import("../views/searchRes.vue")
        },
        {
          path: "",
          redirect: "/search"
        },
        {
          path: "/comment",
          component: () => import("../views/comment.vue")
        },
        {
          path: "/minecomment",
          component: () => import("../views/mineComment")
        },
        {
          path: "/refresh",
          component: () => import("../views/refresh")
        },
      ]
    },
    {
      path: "/error",
      component: () => import("../pages/error.vue")
    },
    {
      path: "/login",
      component: () => import("../pages/login.vue")
    },
    {
      path: "/register",
      component: () => import("../pages/register.vue")
    },
    {
      path: "/addmov",
      component: () => import("../pages/addmov.vue")
    },
    {
      path: "/addartist",
      component: () => import("../pages/addartist.vue")
    },
    {
      path: "/adddetails",
      component: () => import("../pages/adddetails.vue")
    },

    {
      path: "*",
      redirect: "/index"
    }
  ]
})
