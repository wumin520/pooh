import {
  URI_ACCOUNTSETTING,
  URI_BIND_MOBILE,
  URI_SEND_CHECKCODE,
  URI_VALIDATE_MOBILE
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
    // console.log(payload)
    Object.assign(state, {info: {
      ...payload.info,
      password: '',
      new_password: '',
      confirm: '',
      mobile: payload.navbar.mobile
    }})
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
      // console.log(res)
      return res
    }).catch(err => {
      Message({
        message: err.err_msg,
        iconClass: 'qk-warning'
      })
      return err
    })
  },

  sendCode ({commit}, {mobile, checkBind}) {
    let uri = `${URI_SEND_CHECKCODE}?phone=${mobile}&check_bind=${checkBind}`
    return api(uri)
      .then((res) => {
        let success = false
        if (res.status === 'ok') {
          success = true
        }
        return {success}
      }).catch(err => {
        Message({
          message: err.err_msg,
          iconClass: 'qk-warning'
        })
        return err
      })
  },

  bindMobile ({commit}, {mobile, code}) {
    return api(URI_BIND_MOBILE, {
      method: 'POST',
      body: {phone: mobile, code}
    })
      .then((res) => {
        let success = false
        if (res.status === 'ok') {
          success = true
          Message({
            message: res.payload.message,
            type: 'success'
          })
        }
        return {success}
      }).catch(err => {
        Message({
          message: err.err_msg,
          iconClass: 'qk-warning'
        })
        return err
      })
  },

  validateMobile ({commit}, {phone, code}) {
    let uri = `${URI_VALIDATE_MOBILE}?phone=${phone}&code=${code}`
    return api(uri).then((res) => {
      let success = false
      if (res.status === 'ok') {
        success = true
      }
      return {success}
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
