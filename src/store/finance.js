/* eslint no-unused-vars: off */
import { Message } from 'element-ui'
import api from '../fetch'
import {URI_FINANCE, URI_FINANCE_CHARGE_CANCEL} from '@/constants'

const types = {
  SYNC: 'sync'
}

const initState = () => ({
  payments: [],
  navbar: {}
})

const state = initState()

const getters = {}

const mutations = {
  [types.SYNC] (state, payload) {
    Object.assign(state, {...payload})
  }
}

const actions = {
  getInfo ({commit}, payload) {
    let offset = (payload && payload.offset) || 0
    let limit = (payload && payload.limmit) || 10

    let apiUri = `${URI_FINANCE}?offset=${offset}&limit=${limit}`
    return api(apiUri).then((res) => {
      console.log('actions: ' + URI_FINANCE, res)
      commit(types.SYNC, res.payload)
      return res
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
