import 'normalize.css/normalize.css'
// import 'element-ui/lib/theme-default/index.css'
// 使用定制的 element 钱咖主题
import 'element-theme-qianka/dist/index.css'
import 'element-theme-qianka/dist/qianka.css'

// Polyfill
import 'whatwg-fetch'
import assign from 'object-assign'
Object.assign = assign

// Underground
import './mixins'
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import {sync} from 'vuex-router-sync'
sync(store, router, 'router')

Vue.use(ElementUI)
Vue.config.productionTip = false

window.$router = router

/* eslint-disable no-new */
new Vue({
  el: '[app]',
  router,
  store,
  template: '<App/>',
  components: { App }
})
