import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import accountSetting from './accountSetting'
import charge from './charge'
import adNew from './adNew'
import finance from './finance'
Vue.use(Vuex)

const state = {

}

const getters = {

}

const mutations = {

}

const actions = {

}

export default new Vuex.Store({
  namespaced: true,
  modules: {
    user,
    accountSetting,
    charge,
    adNew,
    finance
  },
  state,
  mutations,
  getters,
  actions
})
