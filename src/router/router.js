import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../pages/home.vue';
import Topics from '../pages/topics.vue';
import Details from '../pages/details.vue';
// import { hub } from '../partials/eventhub.js';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    },
    routes: [{
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/topics/:fid',
            name: 'topics',
            component: Topics
        },
        {
            path: '/details/:tid',
            name: 'details',
            component: Details
        }
        // { path: '/editdaily/:id', component: AddDaily }
        // { path: '*',
        //   redirect: to => {
        //     if (localStorage.getItem('token')) {
        //       return '/home';
        //     } else {
        //       return '/login';
        //     }
        //   }
        // }
    ]
});

export default router;
