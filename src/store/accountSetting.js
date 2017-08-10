import {
  URI_ACCOUNTSETTING
} from '@/constants'
import api from '../fetch'
import { Message } from 'element-ui'

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
    dispatch('updateIndex', 'dash_account', { root: true })
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
    }).catch(err => {
      Message({
        message: err.err_msg,
        iconClass: 'qk-warning'
      })
      return err
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
