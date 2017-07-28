import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'

import Layout from '@/views/Layout'
import Home from '@/views/Home'
import Ad from '@/views/Ad'
import AdNew from '@/views/AdNew'
import Finance from '@/views/Finance'
import Account from '@/views/Account'
import Charge from '@/views/Charge'

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
          path: 'ad',
          component: Ad
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
          name: 'charge',
          path: 'finance/charge',
          component: Charge
        },
        {
          name: 'edit',
          path: 'finance/edit/:id',
          component: Charge
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
