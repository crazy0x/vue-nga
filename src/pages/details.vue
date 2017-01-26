<template lang="html">
  <div class="">
    <mu-appbar title="主题详情">
      <mu-icon-button icon="arrow_back" slot="left" @click.native="back"/>
      主题详情
      <mu-icon-button icon="refresh" slot="right" @click.native="get"/>
      <mu-icon-menu icon="more_vert" slot="right">
        <mu-menu-item title="收藏"/>
        <mu-menu-item title="提醒"/>
        <mu-menu-item title="消息"/>
        <mu-menu-item title="历史浏览"/>
        <mu-menu-item title="字号"/>
        <mu-menu-item title="以上功能全都没有!"/>
      </mu-icon-menu>
    </mu-appbar>
    <mu-snackbar v-if="ST_DETAIL_SNACKBAR" message="网络异常，请检查网络连接" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
    <div class="fab-bottom-right">
      <mu-raised-button :label="ST_DETAIL_PAGE + ' / ' + Math.ceil(ST_DETAIL_TOTAL / 20)" mini backgroundColor="#5b5a56" labelClass="icon_refresh" @click="openBottomSheet"/>
    </div>
    <div class="nav-bottom-right">
      <mu-float-button v-if="ST_DETAIL_PAGE != 1" icon="navigate_before" mini backgroundColor="#5b5a56" class="demo-float-button" iconClass="icon_refresh" @click="before"/>
      <mu-float-button v-if="ST_DETAIL_PAGE != Math.ceil(ST_DETAIL_TOTAL / 20)" icon="navigate_next" mini backgroundColor="#5b5a56" class="demo-float-button" iconClass="icon_refresh" @click="next"/>
    </div>
    <!-- <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/> -->
    <div class="t_title" v-show="ST_DETAIL_PAGE == 1">
      <span>{{ST_DETAIL_SUBJECT}}</span>
      <mu-divider/>
    </div>
    <mu-list>
      <div v-for="list in ST_DETAIL_LIST">
        <div class="items" v-if="list.lou%2 === 0">
          <replies :list="list" :data="ST_DETAIL_ALL" :render="false"></replies>
        </div>
        <div v-else>
          <replies :list="list" :data="ST_DETAIL_ALL" :render="true"></replies>
        </div>
      </div>
    </mu-list>
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-sub-header>跳楼</mu-sub-header>
      <mu-content-block>
        <mu-text-field :hintText="'页数（共' + Math.ceil(ST_DETAIL_TOTAL / 20) + '页）'" type="number" icon="book"  v-model="to_page"/><mu-icon-button icon="send" class="btn_go_jump" @click="goJump(to_page, 1)"/>
        <mu-text-field :hintText="'楼层（共' + ST_DETAIL_TOTAL + '层）'" type="number" icon="location_city"  v-model="to_floor"/><mu-icon-button icon="send" class="btn_go_jump" @click="goJump(to_floor, 2)"/>
      </mu-content-block>
    </mu-bottom-sheet>
    <mu-infinite-scroll :scroller="scroller" :loading="ST_DETAIL_LOADING"/>
    <!-- <mu-linear-progress :size="3" class="progress_d" v-show="init"><mu-linear-progress/> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Replies from './replies.vue';

export default {
  data() {
    return {
      trigger: null,
      scroller: null,
      bottomSheet: false,
      to_page: null,
      to_floor: null
    }
  },
  computed: {
    ...mapGetters(['ST_DETAIL_ALL', 'ST_DETAIL_LIST', 'ST_DETAIL_SUBJECT', 'ST_DETAIL_LOADING', 'ST_DETAIL_SNACKBAR', 'ST_DETAIL_PAGE', 'ST_DETAIL_TOTAL'])
  },
  mounted: function() {
    this.scroller = window;
    this.trigger = this.$el;
    this.$nextTick(this.get());
  },
  methods: {
    hideSnackbar() {
      if (this.snackTimer) clearTimeout(this.snackTimer);
    },
    goJump(num, type) {
      if (type == 1) {
        this.$store.dispatch('AC_DETAIL_GET_LIST', {tid: this.$route.params.tid, page: num});
      } else {
        this.$store.dispatch('AC_DETAIL_GET_LIST', {tid: this.$route.params.tid, page: Math.ceil(num / 20)});
      }
      this.closeBottomSheet();
      this.to_page = null;
      this.to_floor = null;
    },
    closeBottomSheet() {
      this.bottomSheet = false;
    },
    openBottomSheet() {
      this.bottomSheet = true;
    },
    next() {
      this.$store.dispatch('AC_DETAIL_GET_LIST', {tid: this.$route.params.tid, page: this.ST_DETAIL_PAGE + 1});
    },
    before() {
      this.$store.dispatch('AC_DETAIL_GET_LIST', {tid: this.$route.params.tid, page: this.ST_DETAIL_PAGE - 1});
    },
    get() {
      this.$store.dispatch('AC_DETAIL_GET_LIST', {tid: this.$route.params.tid, page: 1});
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
