<template lang="html">
  <div class="">
    <mu-appbar title="主题详情">
      <mu-icon-button icon="arrow_back" slot="left" @click.native="back"/>
      <!-- <mu-icon-menu icon="favorite_border" slot="right">
      </mu-icon-menu> -->
      主题详情
      <mu-icon-button icon="refresh" slot="right" @click.native="refresh"/>
      <mu-icon-menu icon="more_vert" slot="right">
        <mu-menu-item title="收藏"/>
        <mu-menu-item title="提醒"/>
        <mu-menu-item title="消息"/>
        <mu-menu-item title="历史浏览"/>
        <mu-menu-item title="字号"/>
        <mu-menu-item title="以上功能全都没有!"/>
      </mu-icon-menu>
    </mu-appbar>
    <mu-snackbar v-if="snackbar" message="网络异常，请检查网络连接" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
    <div v-if="btn_page" class="fab-bottom-right">
      <mu-raised-button :label="btn_page" mini backgroundColor="#5b5a56" labelClass="icon_refresh" @click="openBottomSheet"/>
    </div>
    <div v-if="btn_page" class="nav-bottom-right">
      <mu-float-button v-if="this.page != 1" icon="navigate_before" mini backgroundColor="#5b5a56" class="demo-float-button" iconClass="icon_refresh" @click="refresh"/>
      <mu-float-button v-if="this.page != Math.ceil(this.data.__ROWS / 20)" icon="navigate_next" mini backgroundColor="#5b5a56" class="demo-float-button" iconClass="icon_refresh" @click="next"/>
    </div>
    <!-- <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/> -->
    <div class="t_title" v-show="page == 1">
      <span>{{this.data.__T.subject}}</span>
      <mu-divider/>
    </div>
    <mu-list>
      <div v-for="list in lists">
        <div class="items" v-if="list.lou%2 === 0">
          <replies :list="list" :data="data" :render="false"></replies>
        </div>
        <div v-else>
          <replies :list="list" :data="data" :render="true"></replies>
        </div>
      </div>
    </mu-list>
    <!-- <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="load"/> -->
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-sub-header>跳楼</mu-sub-header>
      <mu-content-block>
        <mu-text-field :hintText="page_hint" type="number" icon="book"  v-model="to_page"/><mu-icon-button icon="send" class="btn_go_jump" @click="goJump(to_page, 1)"/>
        <mu-text-field :hintText="floor_hint" type="number" icon="location_city"  v-model="to_floor"/><mu-icon-button icon="send" class="btn_go_jump" @click="goJump(to_floor, 2)"/>
      </mu-content-block>
    </mu-bottom-sheet>
    <!-- <mu-linear-progress :size="3" class="progress_d" v-show="init"><mu-linear-progress/> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Replies from './replies.vue';

export default {
  data() {
    return {
      data: {
        __T: {
          subject: ''
        }
      },
      refreshing: false,
      init: true,
      // loading: false,
      trigger: null,
      // scroller: null,
      page: 1,
      lists: [],
      btn_page: null,
      bottomSheet: false,
      to_page: null,
      to_floor: null,
      snackbar: false,
      page_hint: '',
      floor_hint: '',
      is_wifi: localStorage.getItem('is_wifi').length == 4 ? true : false
    }
  },
  computed: {
    ...mapGetters(['baseurl', 'baseurl_pic'])
  },
  mounted: function() {
    // this.scroller = window;
    this.trigger = this.$el;
    this.$nextTick(this.get());
  },
  methods: {
    showSnackbar() {
      this.snackbar = true;
      if (this.snackTimer) clearTimeout(this.snackTimer);
      this.snackTimer = setTimeout(() => { this.snackbar = false }, 2000);
    },
    hideSnackbar() {
      this.snackbar = false;
      if (this.snackTimer) clearTimeout(this.snackTimer);
    },
    goJump(num, type) {
      if (type == 1) {
        this.page = num;
      } else {
        this.page = Math.ceil(num / 20);
      }
      this.closeBottomSheet();
      this.to_page = null;
      this.to_floor = null;
      this.get();
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    openBottomSheet() {
      this.bottomSheet = true;
    },
    next() {
      this.page = this.page + 1;
      this.loading = true;
      this.get();
    },
    refresh() {
      this.page = 1;
      this.refreshing = true;
      this.get();
    },
    get() {
      this.$http({
        url: this.baseurl + '/read',
        method: 'GET',
        params: {
          tid: this.$route.params.tid,
          page: this.page
        }
      }).then(function(response) {
        console.log(response.data.data);
        this.assembleData(response);
        this.refreshing = false;
        this.loading = false;
        this.init = false;
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, function(response) {
        this.response(response);
      });
    },
    assembleData(response) {
      this.data = response.data.data;
      this.lists = [];
      for (var i = 0; i < response.data.data.__R__ROWS; i++) {
        if (response.data.data.__R[i].content) {
          response.data.data.__R[i].content = this.replaceContent(response.data.data.__R[i].content);
          if(response.data.data.__R[i].comment) {
            var comments = new Array();
            for (var c in response.data.data.__R[i].comment){
              response.data.data.__R[i].comment[c].content = this.replaceContent(response.data.data.__R[i].comment[c].content);
              comments.push(response.data.data.__R[i].comment[c]);
            }
            response.data.data.__R[i].comment = comments;
          }
          this.lists = this.lists.concat(response.data.data.__R[i]);
        } else {
          response.data.data.__R[i].content = this.replaceContent(response.data.data.__R[i].subject);
          this.lists = this.lists.concat(response.data.data.__R[i]);
        }
      }
      this.btn_page = this.page + ' / ' + Math.ceil(this.data.__ROWS / 20);
      this.page_hint = '页数（共' + Math.ceil(this.data.__ROWS / 20) + '页）';
      this.floor_hint = '楼层（共' + this.data.__ROWS + '层）';
    },
    response(response) {
      console.log('fail' + response.status);
      this.showSnackbar();
      this.refreshing = false;
      this.loading = false;
      this.init = false;
    },
    replaceContent(content) {
      if (this.is_wifi) {
        content = content.toString().replace(new RegExp(/\[img\]\./g), "<img class=\"pics\" src=\"" + this.baseurl_pic + "http://img.ngacn.cc/attachments").replace(new RegExp(/\[\/img\]/g), "\">");
        content = content.toString().replace(new RegExp(/\[img\]/g), "<img class=\"pics\" src=\"" + this.baseurl_pic);
      } else {
        content = content.toString().replace(new RegExp(/\[img\]\./g), "<img class=\"pics\" src=\"http://img.ngacn.cc/attachments").replace(new RegExp(/\[\/img\]/g), "\">");
        content = content.toString().replace(new RegExp(/\[img\]/g), "<img class=\"pics\" src=\"");
      }
      return content.replace(new RegExp(/\[/g), "<").replace(new RegExp(/\]/g), ">");
    },
    back() {
      this.$router.go(-1);
    },
  },
  components: {
    Replies
  }
}
</script>

<style lang="css">
  .pics {
    max-height: 100%;
    max-width: 80%;
  }
  .progress_d {
    position: relative;
    top: -70px;
    left: 50px;
  }
  .t_title {
    padding: 8px;
    line-height: 30px;
    font-size: 18px;
    font-weight: bold;
  }
  .bs_jump {
    color: #000000;
  }
  .btn_go_jump {
    float: right;
    position: absolute;
  }
  .switch_page {
    width: 50px;
  }
  .demo-float-button {
    margin-left: 10px;
  }
</style>
