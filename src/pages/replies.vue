<template lang="html">
  <div class="replies" :class="{is_render: render}">
    <mu-list-item :disableRipple="true" :title="data.__U[list.authorid].username.toString().replace('#anony_', '匿名').substring(0,18) + ' ' + list.authorid">
      <!-- <mu-avatar :src="require('../assets/ic_face_black_36dp_1x.png')" slot="leftAvatar"/> -->
      <mu-avatar :src="getAvatar(data.__U[list.authorid].avatar)" slot="leftAvatar"/>
      <div slot="right" v-if="list.lou === 0">楼主</div>
      <div slot="right" v-else>{{list.lou}}楼</div>
      <span slot="describe" style="color:#000000">
        发帖: {{data.__U[list.authorid].postnum}}
      </span>
    </mu-list-item>
    <mu-divider/>
    <mu-content-block>
      <div v-html="list.content"/>
    </mu-content-block>
    <mu-content-block style="color:gray">
      {{list.postdate}}<mu-icon class="device" v-if="list.from_client" value="phone_iphone" @click="showToast(list.from_client)"/>
    </mu-content-block>
    <div v-if="list.comment">
      <!-- <mu-sub-header style="color:#000000"><mu-icon value="inbox"/></mu-sub-header> -->
      <mu-content-block v-for="(c,index) in list.comment">
        <mu-icon value="local_offer" class="tag" v-if="index===0"/><mu-divider inset v-if="index===0"/>
        <mu-divider v-else/>
        <br>
        <b><i>{{data.__U[c.authorid].username.toString().replace('#anony_', '匿名')}}</i></b><div v-html="c.content.toString().replace('#anony_', '匿名')"/>
      </mu-content-block>
    </div>
    <mu-divider/>
    <mu-toast style="color:#000000;background-color:#fff0cd;text-align:center;" v-if="toast" :message="message" @close="hideToast"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      toast: false,
      message: '',
      pic: '',
      is_wifi: localStorage.getItem('is_wifi').length == 4 ? true : false
    }
  },
  computed: {
    ...mapGetters(['ST_BASEURL_PIC'])
  },
  props: ['list', 'data', 'render'],
  methods: {
    showToast(msg) {
      this.toast = true;
      this.message = msg;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toast = false }, 2000);
    },
    hideToast() {
      this.toast = false;
      if (this.toastTimer) clearTimeout(this.toastTimer);
    },
    getAvatar(url) {
      if (this.is_wifi && url instanceof Object) {
        this.pic = url[0].toString().replace('http://', this.ST_BASEURL_PIC + 'http://');
      } else if(this.is_wifi && url && url.length.toString() > 0) {
        this.pic = url.toString().replace('http://', this.ST_BASEURL_PIC + 'http://');
      } else {
        this.pic = 'http://pic.qiniu.anfensi.com/2016-09-28/57eb6b1dedd0f.png';
      }
      return this.pic;
    }
  }
}
</script>

<style lang="css">
  .replies {
    margin-top: 0px;
    width: 100%;
  }
  .tag {
    position: absolute;
    margin-top: -10px;
  }
  .device {
    float: right;
  }
  .is_render {
    background-color: #fff0cd;
  }
</style>
