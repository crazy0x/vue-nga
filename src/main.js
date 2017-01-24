import Vue from 'vue';
import store from './vuex/store';
import router from './router/router';
import VueResource from 'vue-resource';
import './css/style.css';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-dark.css';
import App from './App.vue';

Vue.use(MuseUI);
Vue.use(VueResource);

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  store,
  render: h => h(App)
});
