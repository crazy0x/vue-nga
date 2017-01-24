<template lang="html">
  <div class="">
    <mu-appbar :title="title">
      <mu-icon-button icon="arrow_back" slot="left" @click.native="back"/>
      {{title}}
      <mu-icon-menu v-if="is_fav" icon="favorite" slot="right" @click.native="addFav">
      </mu-icon-menu>
      <mu-icon-menu v-else icon="favorite_border" slot="right" @click.native="addFav">
      </mu-icon-menu>
      <mu-icon-menu icon="more_vert" slot="right">
        <mu-menu-item title="提醒"/>
        <mu-menu-item title="消息"/>
        <mu-menu-item title="历史浏览"/>
        <mu-menu-item title="搜索"/>
        <mu-menu-item title="字号"/>
        <mu-menu-item title="以上功能全都没有!"/>
      </mu-icon-menu>
    </mu-appbar>
    <!-- <mu-linear-progress :size="3" class="progress" v-show="init"><mu-linear-progress/> -->
    <mu-snackbar v-if="snackbar" message="网络异常，请检查网络连接" action="关闭" @actionClick="hideSnackbar" @close="hideSnackbar"/>
    <div class="fab-bottom-right">
      <mu-float-button icon="refresh" mini backgroundColor="#5b5a56" iconClass="icon_refresh" @click.native="refresh"/>
    </div>
    <div class="topic_lists">
      <!-- <mu-refresh-control :refreshing="refreshing" :trigger="trigger" @refresh="refresh"/> -->
      <mu-list>
        <div v-for="(list,index) in lists">
          <div class="is_render" v-if="index%2 === 0">
            <mu-list-item :disableRipple="true" :disable="true" :title="list.subject.toString()" @click.native="open_d(list.tid, list.quote_from)">
              <span slot="describe">
                <img src="../assets/ic_group_black_18dp_1x.png" class="underline"><span class="author">{{list.author.toString().replace('#anony_', '匿名').substring(0,18)}}</span> <span class="reply">{{list.replies}} 回复</span>
              </span>
            </mu-list-item>
            <mu-divider/>
          </div>
          <div v-else>
            <mu-list-item :disableRipple="true" :disable="true" :title="list.subject.toString()" @click.native="open_d(list.tid, list.quote_from)">
              <span slot="describe">
                <img src="../assets/ic_group_black_18dp_1x.png" class="underline"><span class="author">{{list.author.toString().replace('#anony_', '匿名').substring(0,18)}}</span> <span class="reply">{{list.replies}} 回复</span>
              </span>
            </mu-list-item>
            <mu-divider/>
          </div>
        </div>
      </mu-list>
    </div>

    <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="load"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      data: {},
      refreshing: false,
      // init: true,
      loading: false,
      trigger: null,
      scroller: null,
      page: 1,
      lists: [],
      snackbar: false,
      is_fav: false,
      title: this.$route.query.name,
      curr_t_info: null,
      my_favs: null
    };
  },
  computed: {
    ...mapGetters(['baseurl'])
  },
  mounted: function() {
    this.scroller = window;
    this.trigger = this.$el;
    if (localStorage.getItem('topic_lists') && JSON.parse(localStorage.getItem('topic_lists')).length > 0 && localStorage.getItem('curr_t') == localStorage.getItem('saved_t')) {
      this.lists = JSON.parse(localStorage.getItem('topic_lists'));
    } else {
      this.$nextTick(this.get());
    }
    this.curr_t_info = JSON.parse(localStorage.getItem('curr_t_info'));
    if (localStorage.getItem('my_favs')) {
      this.my_favs = JSON.parse(localStorage.getItem('my_favs'));
      if (this.my_favs[this.curr_t_info.topic]) {
        this.is_fav = true;
      } else {
        this.is_fav = false;
      }
    }
  },
  methods: {
    addFav() {
      if(this.is_fav) {
        delete this.my_favs[this.curr_t_info.topic];
        this.is_fav = false;
      } else {
        if(!this.my_favs) {
          this.my_favs = new Object();
        }
        this.my_favs[this.curr_t_info.topic] = this.curr_t_info;
        this.is_fav = true;
      }
      localStorage.setItem('my_favs', JSON.stringify(this.my_favs));
    },
    showSnackbar() {
      this.snackbar = true;
      if (this.snackTimer) clearTimeout(this.snackTimer);
      this.snackTimer = setTimeout(() => { this.snackbar = false }, 2000);
    },
    hideSnackbar() {
      this.snackbar = false;
      if (this.snackTimer) clearTimeout(this.snackTimer);
    },
    load() {
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
      console.log(this.baseurl);
      this.$http({
        url: this.baseurl + '/thread',
        method: 'GET',
        params: {
          fid: this.$route.params.fid,
          page: this.page
        }
      }).then(function(response) {
        this.data = response.data.data;
        console.log(response.data.data);
        this.assembleData(response);
        this.refreshing = false;
        this.loading = false;
        // this.init = false;
      }, function(response) {
        this.response(response);
      });
    },
    assembleData(response) {
      if (this.page === 1) {
        this.lists = [];
        localStorage.removeItem('topic_lists');
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
      for (var i = 0; i < response.data.data.__T__ROWS; i++) {
        if (response.data.data.__T[i]) {
          this.lists = this.lists.concat(response.data.data.__T[i]);
        }
      }
      localStorage.setItem('saved_t', this.$route.params.fid);
      localStorage.setItem('topic_lists', JSON.stringify(this.lists));
    },
    response(response) {
      console.log('fail' + response.status);
      this.showSnackbar();
      this.refreshing = false;
      this.loading = false;
      // this.init = false;
    },
    back() {
      this.$router.go(-1);
    },
    open_d(id, quote) {
      if (quote === 0)
        this.$router.push('/details/' + id)
      else
        this.$router.push('/details/' + quote)
    }
  }
};
</script>

<style lang="css">
  .progress {
    position: relative;
    z-index: -100;
    /*top: -55px;*/
  }

  .underline {
    margin-top: 17px;
  }

  .author {
    position: relative;
    left: 5px;
    top: -5px;
    /*bottom: 5px;*/
    /*left: -5px;*/
    color: #000000;
  }

  .reply {
    /*position: relative;*/
    float: right;
    margin-top: 17px;
    color: #000000;
  }

  .nav-bottom-right {
    float: right;
    position: fixed;
    bottom: 3px;
    right: 10px;
    z-index: 900;
  }

  .fab-bottom-right {
    float: right;
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 900;
  }

  .lists {
    margin-top: 0px;
    z-index: 100;
  }

  .icon_refresh {
    color: #fff0cd;
  }

  .topic_lists {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    user-select: none;
  }
</style>
