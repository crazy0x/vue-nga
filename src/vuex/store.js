import Vue from 'vue';
import Vuex from 'vuex';

// 告诉 vue “使用” vuex
Vue.use(Vuex);

// 创建一个对象来保存应用启动时的初始状态
const store = new Vuex.Store({
  state: {
    // baseurl: 'http://127.0.0.1:8088/nga',
    // baseurl_pic: 'http://127.0.0.1:8088/nga/pic?url='
    // baseurl: 'http://139.196.25.241:8080/nga/nga',
    // baseurl_pic: 'http://139.196.25.241:8080/nga/nga/pic?url='
    baseurl: '../nga/nga',
    baseurl_pic: '../nga/nga/pic?url='
  },
  getters: {
    baseurl: state=>state.baseurl,
    baseurl_pic: state=>state.baseurl_pic
  },
  mutations: {
  }
});

export default store;
