import {
  URI_DASHBOARD
} from '@/constants'

const types = {
  SYNC: 'sync'
}

const initState = () => ({
  dashboard: {
    username: '',
    balance: '0.00',
    portals: []
  }
})

const state = initState()

const getters = {
  // TODO:
}

const mutations = {
  [types.SYNC] (state, payload) {
    // TODO: 入口逻辑

    Object.assign({}, {
      username: payload.username,
      balance: payload.balance
    })
  }
}

const actions = {
  dashboard ({commit}) {
    return fetch(URI_DASHBOARD)
      .then(res => {
        let payload = res && res.data && res.data.payload
        if (payload) commit(types.SYNC, res)
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
