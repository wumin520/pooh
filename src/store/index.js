import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import accountSetting from './accountSetting'
import charge from './charge'
import adNew from './adNew'
import finance from './finance'
import ad from './ad'
import priceSys from './priceSys'
import cookie from '../cookie'

import loanFinance from './loan/finance'
import loanCharge from './loan/charge'

Vue.use(Vuex)

const state = {
  activeIndex: '',
  atype: ''
}

const getters = {

}

const types = {
  UPDATE_ACTIVE_INDEX: 'update_active_index',
  UPDATE_ATYPE: 'update_atype'
}

const mutations = {
  [types.UPDATE_ACTIVE_INDEX] (state, paramsName) {
    switch (paramsName) {
      case 'dash_home':
        state.activeIndex = '1'
        break
      case 'dash_ad':
        state.activeIndex = '2'
        break
      case 'dash_ad_new':
        state.activeIndex = '2-1'
        break
      case 'dash_finance':
        state.activeIndex = '3'
        break
      case 'dash_finance_charge':
        state.activeIndex = '3'
        break
      case 'dash_account':
        state.activeIndex = '4'
        break
    }
  },
  [types.UPDATE_ATYPE] (state, atype) {
    state.atype = atype
  }
}

const actions = {
  updateIndex ({commit, state}, paramsName) {
    commit(types.UPDATE_ACTIVE_INDEX, paramsName)
  },

  updateAtype ({commit}) {
    let atype = cookie.get('atype')
    commit(types.UPDATE_ATYPE, atype)
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
    loanFinance,
    loanCharge
  },
  state,
  mutations,
  getters,
  actions
})
