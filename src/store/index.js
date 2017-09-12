import Vue from 'vue'
import Vuex from 'vuex'
import user from './task/user'
import accountSetting from './accountSetting'
import charge from './task/charge'
import adNew from './task/adNew'
import finance from './task/finance'
import ad from './task/ad'
import priceSys from './task/priceSys'
// 借钱
import loanUser from './loan/user'

import { URI_LOGOUT } from '@/constants'
import { Message } from 'element-ui'
import cookie from '../cookie'

import loanFinance from './loan/finance'
import loanCharge from './loan/charge'

// 高额
import gaoeAd from './gaoe/ad.js'
import gaoeAdNew from './gaoe/adNew'
import gaoeUser from './gaoe/user'

Vue.use(Vuex)

const state = {
  activeIndex: '',
  atype: '',
  navbar: {
    username: '',
    balance: '0.00',
    balance_threshold: '0.00',
    unsettled_amount: '0.00'
  }
}

const getters = {
  // navbar field
  username: state => {
    return state.navbar.username
  },

  unsettledAmount: state => {
    return state.navbar.unsettled_amount
  },

  balance: state => {
    return state.navbar.balance
  },

  balanceThreshold: state => {
    return state.navbar.balance_threshold
  }
}

const types = {
  UPDATE_ACTIVE_INDEX: 'update_active_index',
  UPDATE_ATYPE: 'update_atype',
  SYNC_NAVBAR: 'sync_navbar'
}

const mutations = {
  [types.UPDATE_ACTIVE_INDEX] (state, paramsName) {
    let routeName = paramsName
    switch (routeName) {
      case 'loan_dash_finance_charge':
        routeName = 'loan_dash_finance'
        break
      case 'dash_finance_price':
        routeName = 'dash_finance'
        break
      case 'dash_finance_charge':
        routeName = 'dash_finance'
        break

      case 'dash_ad_new':
        routeName = 'dash_ad'
        break
      case 'gaoe_dash_ad_new':
        routeName = 'gaoe_dash_ad'
        break
    }
    state.activeIndex = routeName
  },
  [types.UPDATE_ATYPE] (state, atype) {
    state.atype = atype
  },
  [types.SYNC_NAVBAR] (state, payload) {
    state.navbar = payload.navbar
  }
}

const actions = {
  logout () {
    fetch(URI_LOGOUT, {
      credentials: 'same-origin'
    })
    .then(res => res.json())
    .then(res => {
      $router.push('/login')
    })
    .catch(err => {
      Message({
        message: err.err_msg,
        iconClass: 'qk-warning'
      })
    })
  },

  updateIndex ({commit, state}, paramsName) {
    commit(types.UPDATE_ACTIVE_INDEX, paramsName)
  },

  updateAtype ({commit}) {
    let atype = cookie.get('atype')
    commit(types.UPDATE_ATYPE, atype)
  },

  updateNavbar ({ commit }, payload) {
    commit(types.SYNC_NAVBAR, payload)
  }
}

export default new Vuex.Store({
  namespaced: true,
  modules: {
    user,
    accountSetting,
    charge,
    adNew,
    finance,
    ad,
    priceSys,
    // 借钱
    loanFinance,
    loanCharge,
    loanUser,
    // 高额
    gaoeAdNew,
    gaoeUser,
    gaoeAd
    // 信用卡
  },
  state,
  mutations,
  getters,
  actions
})
