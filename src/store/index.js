import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import accountSetting from './accountSetting'
Vue.use(Vuex)

const state = {
  menuIndex: ''
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
    accountSetting
  },
  state,
  mutations,
  getters,
  actions
})
