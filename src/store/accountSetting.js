import {
  URI_ACCOUNTSETTING
} from '@/constants'

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
  getInfo ({commit}) {
    return fetch(URI_ACCOUNTSETTING, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(res => {
        console.log('res')
        console.log(res)
        let payload = res.payload
        if (payload) commit(types.SYNC, payload)
        return res
      })
  },

  submitInfo ({ commit }, payload) {
    let params = ''
    for (let key in payload) {
      console.log(key)
      params += key + '=' + payload[key] + '&'
    }
    return fetch(URI_ACCOUNTSETTING, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
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
