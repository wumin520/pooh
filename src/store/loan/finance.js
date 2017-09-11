/* eslint no-unused-vars: off */
import { Message } from 'element-ui'
import api from '../../fetch'
import {URI_LOAN_FINANCE, URI_LOAN_FINANCE_CHARGE_CANCEL} from '@/constants'

const types = {
  SYNC: 'sync'
}

const initState = () => ({
  loan_list: [],
  navbar: {},
  total_count: 0,
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
    let apiUri = `${URI_LOAN_FINANCE}?offset=${offset}&limit=${state.limit}`
    return api(apiUri).then(({payload}) => {
      // console.log('actions: ' + URI_FINANCE, payload)
      if (payload.navbar) dispatch('user/updateNavbar', payload, { root: true })
      commit(types.SYNC, payload)
    })
  },

  cancelCharge ({commit}, id) {
    return api(URI_LOAN_FINANCE_CHARGE_CANCEL, {
      method: 'POST',
      body: {id}
    }).then((res) => {
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
