import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
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
    user
  },
  state,
  mutations,
  getters,
  actions
})
