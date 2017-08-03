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
      path: '/login',
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
          name: 'dash_home',
          path: 'home',
          component: Home
        },
        {
          name: 'dash_ad',
          path: 'ad/ios/:status',
          component: Ad
        },
        {
          name: 'dash_ad_new',
          path: 'ad/new',
          component: AdNew // 新添加
        },
        {
          name: 'dash_ad_renew',
          path: 'ad/renew/:taskId',
          component: AdNew // 续单
        },
        {
          name: 'dash_ad_edit',
          path: 'ad/edit/:taskId',
          component: AdNew // 编辑
        },
        {
          name: 'dash_finance',
          path: 'finance',
          component: Finance
        },
        {
          name: 'dash_finance_charge',
          path: 'finance/charge',
          component: Charge
        },
        {
          name: 'dash_finance_edit',
          path: 'finance/edit/:id',
          component: Charge
        },
        {
          name: 'dash_account',
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
