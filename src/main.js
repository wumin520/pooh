// Polyfill
import 'whatwg-fetch'
import assign from 'object-assign'
Object.assign = assign

// Underground
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
sync(store, router, 'router')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
