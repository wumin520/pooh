import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import accountSetting from './accountSetting'
import charge from './charge'
import adNew from './adNew'
import finance from './finance'
import ad from './ad'
Vue.use(Vuex)

const state = {
  activeIndex: ''
}

const getters = {

}

const types = {
  UPDATE_ACTIVE_INDEX: 'update_active_index'
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
    console.log('commit activeIndex', state.activeIndex)
  }
}

const actions = {
  updateIndex ({commit, state}, paramsName) {
    console.log('dispatch updateIndex')
    commit(types.UPDATE_ACTIVE_INDEX, paramsName)
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
    ad
  },
  state,
  mutations,
  getters,
  actions
})
