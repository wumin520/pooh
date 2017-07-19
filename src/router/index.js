import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'

import Layout from '@/views/Layout'
import Home from '@/views/Home'
import AdNew from '@/views/AdNew'
import Finance from '@/views/Finance'
import Account from '@/views/Account'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/d',
      component: Layout,
      children: [
        {
          path: 'home',
          component: Home
        },
        {
          path: 'ad/new',
          component: AdNew
        },
        {
          path: 'finance',
          component: Finance
        },
        {
          path: 'account',
          component: Account
        }
      ]
    },
    // 默认路由
    {
      path: '*',
      component: Login
    }
  ],
  mode: 'history'
})
