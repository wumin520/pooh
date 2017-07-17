import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Dashboard from '@/views/Dashboard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    // 默认路由
    {
      path: '*',
      component: Login
    }
  ],
  mode: 'history'
})
