import {
  URI_CHARGE,
  URI_CHARGE_INVOICE
} from '@/constants'
import api from '../fetch'

const types = {
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
  },
  aliInfo: {
    ali_amount: '',
    ali_drawee: '',
    remark: '',
    invoice_status: 0,
    invoice_title: '',
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
  [types.SYNC_INVOICE] ({info, aliInfo}, {title, name, phone, address, remark}) {
    // console.log('mutation title: ' + types.SYNC_INVOICE, title)
    info.invoice_title = title
    info.invoice_contact_name = name
    info.invoice_contact_phone = phone
    info.invoice_contact_address = address
    info.remark = remark
    aliInfo.invoice_title = title
    aliInfo.invoice_contact_name = name
    aliInfo.invoice_contact_phone = phone
    aliInfo.invoice_contact_address = address
    aliInfo.remark = remark
    // Object.assign(state.info, {...payload.invoice})
  }
}

const actions = {
  getInvoiceInfo ({dispatch, commit}) {
    dispatch('updateIndex', 'dash_finance_charge', { root: true })
    return api(URI_CHARGE_INVOICE).then((res) => {
      if (res.payload.navbar) dispatch('user/updateNavbar', res.payload, { root: true })
      commit(types.SYNC_INVOICE, res.payload.invoice)
      return res
    })
  },

  submitInfo ({ commit }, payload) {
    return api(URI_CHARGE, {
      method: 'POST',
      body: payload
    }).then((res) => {
      // console.log(res)
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
