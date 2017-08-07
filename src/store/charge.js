import {
  URI_CHARGE,
  URI_CHARGE_INVOICE,
  URI_CHARGE_EDIT
} from '@/constants'
import api from '../fetch'

const types = {
  SYNC: 'sync',
  SYNC_INVOICE: 'syncInvocie'
}

const initState = () => ({
  info: {
    amount: '',
    amount_check: '',
    drawee: '',
    remark: '',
    invoice_status: 0,
    invoice_title: 'we',
    invoice_contact_name: '',
    invoice_contact_phone: '',
    invoice_contact_address: '',
    is_save_invoice: 1
  }
})

const state = initState()

const getters = {
  // TODO:
}

const mutations = {
  [types.SYNC] ({info}, payload) {
    console.log('mutation:payload: ' + types.SYNC, payload)
    info.amount = payload.coast
    info.amount_check = payload.coast
    info.drawee = payload.drawee
    info.invoice_status = payload.invoice_status
  },

  [types.SYNC_INVOICE] ({info}, {title, name, phone, address, remark}) {
    console.log('mutation title: ' + types.SYNC_INVOICE, title)
    info.invoice_title = title
    info.invoice_contact_name = name
    info.invoice_contact_phone = phone
    info.invoice_contact_address = address
    info.remark = remark
    // Object.assign(state.info, {...payload.invoice})
  }
}

const actions = {
  getInfo ({commit}, id) {
    return api(URI_CHARGE_EDIT + id)
      .then(res => {
        let payload = res.payload
        if (payload) {
          commit(types.SYNC, payload)
          commit(types.SYNC_INVOICE, payload.invoice)
        }
        return res
      })
  },

  getInvoiceInfo ({dispatch, commit}) {
    dispatch('updateIndex', 'dash_finance_charge', { root: true })
    return api(URI_CHARGE_INVOICE).then((res) => {
      // commit(res)
      console.log('getInvoiceInfo', res)
      commit(types.SYNC_INVOICE, res.payload)
      return res
    })
  },

  submitInfo ({ commit }, payload) {
    return api(URI_CHARGE, {
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
