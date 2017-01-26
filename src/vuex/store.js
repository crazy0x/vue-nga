import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import * as types from './nga_types.js'

// 告诉 vue “使用” vuex
Vue.use(Vuex);
Vue.use(VueResource);

// 创建一个对象来保存应用启动时的初始状态
const store = new Vuex.Store({
    state: {
        baseurl: 'http://127.0.0.1:8088/nga',
        baseurl_pic: 'http://127.0.0.1:8088/nga/pic?url=',
        // baseurl: '../nga/nga',
        // baseurl_pic: '../nga/nga/pic?url=',
        topic_list: [],
        topic_refreshing: false,
        topic_loading: false,
        topic_snackbar: false,
        topic_page: 1,
        detail_all: {},
        detail_list: [],
        detail_subject: '',
        detail_loading: false,
        detail_snackbar: false,
        detail_page: 1,
        detail_total: 1
    },
    getters: {
        [types.ST_BASEURL]: state => state.baseurl,
        [types.ST_BASEURL_PIC]: state => state.baseurl_pic,
        [types.ST_TOPIC_LIST]: state => state.topic_list,
        [types.ST_TOPIC_REFRESHING]: state => state.topic_refreshing,
        [types.ST_TOPIC_LOADING]: state => state.topic_loading,
        [types.ST_TOPIC_SNACKBAR]: state => state.topic_snackbar,
        [types.ST_TOPIC_PAGE]: state => state.topic_page,
        [types.ST_DETAIL_ALL]: state => state.detail_all,
        [types.ST_DETAIL_LIST]: state => state.detail_list,
        [types.ST_DETAIL_SUBJECT]: state => state.detail_subject,
        [types.ST_DETAIL_LOADING]: state => state.detail_loading,
        [types.ST_DETAIL_SNACKBAR]: state => state.detail_snackbar,
        [types.ST_DETAIL_PAGE]: state => state.detail_page,
        [types.ST_DETAIL_TOTAL]: state => state.detail_total
    },
    mutations: {
        [types.MT_TOPIC_CLEAR_LIST](state) {
            state.topic_list = new Array();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
        [types.MT_TOPIC_ADD_LIST](state, data) {
            for (var i = 0; i < data.__T__ROWS; i++) {
                if (data.__T[i]) {
                    state.topic_list = state.topic_list.concat(data.__T[i]);
                }
            }
            state.topic_refreshing = false;
            state.topic_loading = false;
        },
        [types.MT_TOPIC_MOD_REFRESHING](state, is_refreshing) {
            state.topic_refreshing = is_refreshing;
        },
        [types.MT_DETAIL_CLEAR_LIST](state) {
            state.detail_subject = '';
            state.detail_list = new Array();
        },
        [types.MT_DETAIL_ADD_LIST](state, data) {
            function replaceContent(content) {
                // content = content.toString().replace(new RegExp(/\[url\]/g), "<a herf=\"").replace(new RegExp(/\[\/url\]/g), "\">超链接<\/a>");
                if (localStorage.getItem('is_wifi').length == 4 ? true : false) {
                    content = content.toString().replace(new RegExp(/\[img\]\./g), "<img class=\"pics\" src=\"" + state.baseurl_pic + "http://img.ngacn.cc/attachments").replace(new RegExp(/\[\/img\]/g), "\">");
                    content = content.toString().replace(new RegExp(/\[img\]/g), "<img class=\"pics\" src=\"" + state.baseurl_pic);
                } else {
                    content = content.toString().replace(new RegExp(/\[img\]\./g), "<img class=\"pics\" src=\"http://img.ngacn.cc/attachments").replace(new RegExp(/\[\/img\]/g), "\">");
                    content = content.toString().replace(new RegExp(/\[img\]/g), "<img class=\"pics\" src=\"");
                }
                return content.replace(new RegExp(/\[/g), "<").replace(new RegExp(/\]/g), ">");
            };
            for (var i = 0; i < data.__R__ROWS; i++) {
                if (data.__R[i].content) {
                    data.__R[i].content = replaceContent(data.__R[i].content);
                    if (data.__R[i].comment) {
                        var comments = new Array();
                        for (var c in data.__R[i].comment) {
                            data.__R[i].comment[c].content = replaceContent(data.__R[i].comment[c].content);
                            comments.push(data.__R[i].comment[c]);
                        }
                        data.__R[i].comment = comments;
                    }
                    state.detail_list = state.detail_list.concat(data.__R[i]);
                } else {
                    data.__R[i].content = replaceContent(data.__R[i].subject);
                    state.detail_list = state.detail_list.concat(data.__R[i]);
                }
            }
        },
    },
    actions: {
        [types.AC_TOPIC_GET_LIST]({commit, state}, para) {
            state.topic_loading = true;
            if (state.topic_list.length === 0 || para.page > 1 || state.topic_refreshing) {
                Vue.http({
                    url: state.baseurl + '/thread',
                    method: 'GET',
                    params: {
                        fid: para.fid,
                        page: para.page
                    }
                }).then(res => {
                    var last_topics = state.topic_list
                    if (para.page === 1) {
                        commit(types.MT_TOPIC_CLEAR_LIST);
                    }
                    commit(types.MT_TOPIC_ADD_LIST, res.data.data);
                    state.topic_page = para.page;
                }, res => {
                    console.log('fail' + res.status);
                    state.topic_snackbar = true;
                    if (Vue.snackTimer) clearTimeout(Vue.snackTimer);
                    Vue.snackTimer = setTimeout(() => {
                        Vue.snackbar = false
                    }, 2000);
                    state.topic_refreshing = false;
                    state.topic_loading = false;
                });
            }
        },
        [types.AC_DETAIL_GET_LIST]({commit, state}, para) {
            state.detail_loading = true;
            commit(types.MT_DETAIL_CLEAR_LIST);
            Vue.http({
                url: state.baseurl + '/read',
                method: 'GET',
                params: {
                    tid: para.tid,
                    page: para.page
                }
            }).then(res => {
                // console.log(res.data.data);
                state.detail_all = res.data.data;
                state.detail_subject = res.data.data.__T.subject;
                state.detail_page = para.page;
                state.detail_total = res.data.data.__ROWS;
                state.detail_loading = false;
                commit(types.MT_DETAIL_ADD_LIST, res.data.data);
            }, res => {
                console.log('fail' + res.status);
                if (Vue.snackTimer) clearTimeout(Vue.snackTimer);
                Vue.snackTimer = setTimeout(() => {
                    Vue.snackbar = false
                }, 2000);
                state.detail_snackbar = true;
                state.detail_loading = false;
            });
        }
    }
});

export default store;
