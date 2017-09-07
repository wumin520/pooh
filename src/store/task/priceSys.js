/* eslint no-unused-vars: off */
import { Message } from 'element-ui'
import api from '../../fetch'
import {URI_PRICE_SYS} from '@/constants'

const initState = () => ({
})

const state = initState()

const getters = {}

const mutations = {
}

const actions = {
  getInfo ({dispatch}) {
    return api(URI_PRICE_SYS).then(({payload}) => {
      if (payload.navbar) dispatch('user/updateNavbar', payload, { root: true })
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
