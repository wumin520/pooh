import {
  URI_ACCOUNTSETTING
} from '@/constants'
import api from '../fetch'

const types = {
  SYNC: 'sync'
}

const initState = () => ({
  info: {}
})

const state = initState()

const getters = {
  // TODO:
}

const mutations = {
  [types.SYNC] (state, payload) {
    // TODO: 入口逻辑
    console.log(payload)
    Object.assign(state, {info: {...payload.info, password: '', new_password: '', confirm: ''}})
    // state.info = payload.info
  }
}

const actions = {
  getInfo ({commit, dispatch}) {
    return api(URI_ACCOUNTSETTING)
      .then(res => {
        let payload = res.payload
        if (payload) {
          commit(types.SYNC, payload)
          if (payload.navbar) dispatch('user/updateNavbar', payload, { root: true })
        }
        return res
      })
  },

  submitInfo ({ commit }, payload) {
    return api(URI_ACCOUNTSETTING, {
      method: 'POST',
      body: payload
    }).then((res) => {
      console.log(res)
      return res
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
