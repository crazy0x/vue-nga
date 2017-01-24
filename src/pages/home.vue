<template lang="html">
  <div class="home">
    <mu-appbar title="艾泽拉斯国家地理">
      <mu-icon-button icon='menu' slot="left" @click="toggle(true)"/>
      艾泽拉斯国家地理
      <mu-icon-button icon='search' slot="right" @click="showToast('登录都没有哪来的搜索!')"/>
    </mu-appbar>
    <mu-toast style="color:#000000;background-color:#fff0cd;text-align:center;" v-if="toast" :message="message" @close="hideToast"/>
    <mu-tabs :value="activeTab" @change="handleTabChange">
      <mu-tab value="tab1" title="我的收藏"/>
      <mu-tab value="tab2" title="游戏综合"/>
      <mu-tab value="tab3" title="玩家生活"/>
      <mu-tab value="tab4" title="魔兽世界"/>
    </mu-tabs>
    <div v-if="activeTab === 'tab1'">
      <home-list title="收藏" :topics="my_favs"></home-list>
    </div>
    <div v-if="activeTab === 'tab2'">
      <home-list title="热门推荐" :topics="topics.games_hot"></home-list>
      <home-list title="暴雪" :topics="topics.games_blizzard"></home-list>
      <home-list title="沃尔沃" :topics="topics.games_valve"></home-list>
      <home-list title="网游" :topics="topics.games_online"></home-list>
      <home-list title="手游" :topics="topics.games_mobile"></home-list>
    </div>
    <div v-if="activeTab === 'tab3'">
      <home-list title="杂谈" :topics="topics.water"></home-list>
    </div>
    <div v-if="activeTab === 'tab4'">
      <home-list title="CCQ" :topics="topics.wow"></home-list>
    </div>
    <mu-drawer :open="open" :docked="docked" @close="toggle()">
      <div class="avatar">
        <mu-paper class="avatar-paper" circle :zDepth="5">
          <mu-avatar :src="require('../assets/avatar.jpg')" :size="100"/>
        </mu-paper>
        <i><b style="color:#000000;">crazy0x0419@gmail.com</b></i>
        <br>
        <br>
        <mu-icon value="home" color="black"/>
        <br>
        <br>
      </div>
      <mu-divider/>
      <div class="menu">
        <mu-list @itemClick="docked ? '' : toggle()">
          <mu-list-item title="论坛">
            <mu-icon slot="left" value="mode_comment"/>
          </mu-list-item>
          <mu-divider/>
          <mu-list-item title="任务">
            <mu-icon slot="left" value="pets"/>
          </mu-list-item>
          <mu-divider/>
          <mu-list-item title="商店">
            <mu-icon slot="left" value="add_shopping_cart"/>
          </mu-list-item>
          <mu-divider/>
          <mu-list-item title="组队">
            <mu-icon slot="left" value="people"/>
          </mu-list-item>
          <mu-divider/>
          <mu-list-item title="扫码">
            <mu-icon slot="left" value="crop_free"/>
          </mu-list-item>
          <mu-divider/>
          <mu-list-item title="数据">
            <mu-icon slot="left" value="assessment"/>
          </mu-list-item>
          <mu-divider/>
          <mu-sub-header>上面都用不了 !</mu-sub-header>
          <mu-divider/>
          <mu-list-item title="设置" @click.native="openSettings">
            <mu-icon slot="left" value="settings"/>
          </mu-list-item>
          <mu-list-item v-if="docked" @click.native="open = false" title="Close"/>
        </mu-list>
      </div>
    </mu-drawer>
    <mu-dialog :open="settings" title="设置" @close="closeSettings">
      <mu-switch label="有没有WIFI? 有没有WIFI?" labelLeft class="demo-switch" :value="is_wifi" @change="changeWifi"/>
    <mu-flat-button slot="actions" color="black" @click="closeSettings" label="确定"/>
  </mu-dialog>
  </div>
</template>

<script>
import topics from '../data/topics.js';
import HomeList from './home_list.vue'

export default {
    data() {
        return {
            activeTab: 'tab1',
            topics: topics,
            my_favs: null,
            message: '',
            toast: false,
            open: false,
            docked: true,
            settings: false,
            is_wifi: false
        };
    },
    mounted: function() {
        this.assembleFavs();
        this.initSettings();
    },
    methods: {
        initSettings() {
          if (localStorage.getItem('is_wifi')) {
            this.is_wifi = localStorage.getItem('is_wifi').length == 4 ? true : false;
          } else {
            localStorage.setItem('is_wifi', this.is_wifi);
          }
        },
        changeWifi() {
          this.is_wifi = !this.is_wifi;
          localStorage.setItem('is_wifi', this.is_wifi);
        },
        closeSettings() {
          this.settings = false;
        },
        openSettings() {
          this.settings = true;
        },
        toggle(flag) {
            this.open = !this.open;
            this.docked = !flag;
        },
        showToast(msg) {
            this.toast = true;
            this.message = msg;
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => {
                this.toast = false
            }, 2000);
        },
        hideToast() {
            this.toast = false;
            if (this.toastTimer) clearTimeout(this.toastTimer);
        },
        handleTabChange(val) {
            this.activeTab = val;
        },
        assembleFavs() {
            var favs = JSON.parse(localStorage.getItem('my_favs'));
            var all = new Array();
            var row = new Array();
            for (var i in favs) {
                row.push(favs[i]);
                if (row.length === 3) {
                    all.push(row);
                    row = new Array();
                    continue;
                }
            }
            all.push(row)
            this.my_favs = all;
        }
    },
    components: {
        HomeList
    }
};
</script>

<style lang="css">
.menu {
  /*text-align: center;*/
  margin-left: 40px;
}

.avatar {
  text-align: center;
}

.avatar-paper {
  position: relative;
  margin-top: 30px;
  margin-bottom: 20px;
  margin-left: 80px;
  width: 100px;
}
</style>
