import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home/router';
import Game from './views/Game/router';

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: [
    ...Home,
    ...Game
  ]
})
