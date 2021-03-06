/* eslint no-unused-vars: off */
import { Message } from 'element-ui'
import api from '../../fetch'
import {URI_FINANCE, URI_FINANCE_CHARGE_CANCEL} from '@/constants'

const types = {
  SYNC: 'sync'
}

const initState = () => ({
  payments: [],
  navbar: {},
  payments_count: 0,
  invoice_flag: 0, // 是否展示开票入口
  limit: 30
})

const state = initState()

const getters = {}

const mutations = {
  [types.SYNC] (state, payload) {
    Object.assign(state, {...payload})
  }
}

const actions = {
  getInfo ({commit, dispatch, state}, params = {page: 1}) {
    let offset = (params.page - 1) * state.limit
    let apiUri = `${URI_FINANCE}?offset=${offset}&limit=${state.limit}`
    return api(apiUri).then(({payload}) => {
      // console.log('actions: ' + URI_FINANCE, payload)
      if (payload.navbar) dispatch('updateNavbar', payload, { root: true })
      commit(types.SYNC, payload)
    })
  },

  cancelCharge ({commit}, id) {
    return api(URI_FINANCE_CHARGE_CANCEL + id).then((res) => {
      console.log('cancelCharge: ', res)
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
