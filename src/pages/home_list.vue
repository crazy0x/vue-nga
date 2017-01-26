<template lang="html">
  <div class="">
    <mu-sub-header>{{title}}</mu-sub-header>
    <mu-row gutter v-for="items in topics">
      <mu-col class="c_menus" width="33" v-for="item in items" @click.native="open(item)">
        <div class="d_menus">
          <img class="m_icons" :src="item.icon" alt="People">
          <br class="m_text">{{item.name}}</br>
        </div>
      </mu-col>
    </mu-row>
  </div>
</template>

<script>
export default {
    data() {
        return {
            toast: false,
            message: '',
            pic: ''
        };
    },
    props: ['title', 'topics'],
    methods: {
        open(item) {
          console.log(item);
            localStorage.setItem('curr_t', item.topic);
            localStorage.setItem('curr_t_info', JSON.stringify(item));
            this.$store.commit('MT_TOPIC_MOD_REFRESHING', true);
            this.$store.commit('MT_TOPIC_CLEAR_LIST');
            this.$router.push('/topics/' + item.topic + '?name=' + item.name);
        }
    }
}
</script>

<style lang="css">
.m_icons {
  height: 50px;
  width: 50px;
  margin-left: 3px;
}

.d_menus {
  height: 100%;
  width: 100%;
  text-align: center;
  padding: 8px;
}

.c_menus {
  width: 33%;
  padding: 8px;
}
</style>
