import {
  URI_INVOICE_LIST,
  URI_INVOICE_CANCEL,
  URI_INVOICE_DETAIL,
  URI_INVOICE_CREATE,
  URI_INVOICE_DATA,
  UIR_INVOICE_UPDATE
} from '@/constants'

import { Message } from 'element-ui'
import api from '@/fetch'
import _ from 'lodash'

const initState = () => ({
  invoice_list: [],
  limit: 30,
  invoice_count: 0,
  // 预览详情
  invoice: {},
  invoice_title: [], // 发票抬头
  invoice_category: [],
  invoice_common: {}, // 普通发票信息
  invoice_special: {}, // 专用发票信息
  // 开票提交的表单
  adForm: {
    invoice_type: 1, // 发票类型
    drawee_id: '', // 开票人
    amount: '', // 开票金额
    invoice_category: '', // 发票内容
    unified_social_credit_code: '', // 社会统一信用代码
    bank_name: '', // 开户银行
    bank_number: '', // 银行账号
    is_invoice_default: 1, // 是否保存为默认开票信息 0:否 1:是
    recipient_name: '', // 收件人姓名
    contact: '', // 手机号码
    address: '', // 收件地址
    remarks: '', // 备注信息
    is_address_default: 1 // 是否保存为默认寄送信息 0:否 1:是
  },
  fail_reason: ''
})

const types = {
  INIT: 'init',
  SYNC: 'sync',
  GET_OPTIONAL: 'get_optional',
  UPDATE_INVOICE_TYPE: 'update_invoice_type',
  SPLICE_INVOICE_DATA: 'splice_invoice_data',
  PREVIEW_DETAIL: 'preview_detail',
  INVOICE_DETAIL: 'invoice_detail'
}

const state = initState()

const getters = {}

const mutations = {
  [types.INIT] (state) {
    _.extend(state, initState())
  },

  [types.SYNC] (state, payload) {
    state.invoice_list = payload.invoice_list
    _.forEach(state.invoice_list, function (n) {
      n.invoice_type_text = n.invoice_type === 1 ? '增值税普通发票' : '增值税专用发票'
      n.status_text = n.status === 0 ? '待审核' : (n.status === 1 ? '审核通过' : '审核失败')
    })
  },

  [types.GET_OPTIONAL] (state, payload) {
    state.invoice_title = payload.invoice_title
    state.invoice_category = payload.invoice_category
    state.invoice_common = payload.invoice_common
    state.invoice_special = payload.invoice_special
    // 下拉框默认
    state.adForm.drawee_id = payload.invoice_common.drawee_id
    state.adForm.invoice_category = payload.invoice_common.invoice_category
    state.adForm.unified_social_credit_code = payload.invoice_common.unified_social_credit_code
    // 默认寄送地址
    state.adForm.recipient_name = payload.send_address.recipient_name
    state.adForm.contact = payload.send_address.contact
    state.adForm.address = payload.send_address.address
    state.adForm.remarks = payload.send_address.remarks
    // 开票金额
    state.adForm.amount = payload.available_invoice
  },

  [types.UPDATE_INVOICE_TYPE] (state) {
    if (state.adForm.invoice_type === 2 && state.invoice_special.drawee_id) {
      state.adForm.drawee_id = state.invoice_special.drawee_id
      state.adForm.invoice_category = state.invoice_special.invoice_category
      state.adForm.unified_social_credit_code = state.invoice_special.unified_social_credit_code
      state.adForm.bank_name = state.invoice_special.bank_name
      state.adForm.bank_number = state.invoice_special.bank_number
    } else if (state.adForm.invoice_type === 1 && state.invoice_common.drawee_id) {
      state.adForm.drawee_id = state.invoice_common.drawee_id
      state.adForm.invoice_category = state.invoice_common.invoice_category
      state.adForm.unified_social_credit_code = state.invoice_common.unified_social_credit_code
    }
  },

  [types.SPLICE_INVOICE_DATA] (state, index) {
    state.invoice_list.splice(index, 1)
  },

  [types.PREVIEW_DETAIL] (state, payload) {
    state.invoice = payload.invoice
    state.invoice_title = payload.invoice_title
    state.invoice_category = payload.invoice_category
  },

  [types.INVOICE_DETAIL] (state, payload) {
    state.invoice_title = payload.invoice_title
    state.invoice_category = payload.invoice_category
    state.fail_reason = payload.invoice.fail_reason
    _.extend(state.adForm, _.pick(payload.invoice, _.keys(state.adForm)))
    state.adForm.amount = payload.available_invoice
    state.adForm.id = payload.id
  }
}

const actions = {
  getInvoiceOptional ({commit, dispatch}) {
    commit(types.INIT)
    return api(URI_INVOICE_DATA, {method: 'GET'})
      .then(res => res.payload)
      .then((payload) => {
        if (payload.navbar) dispatch('updateNavbar', payload, { root: true })
        commit(types.GET_OPTIONAL, payload)
      })
  },

  updateInvoiceType ({commit}) {
    commit(types.UPDATE_INVOICE_TYPE)
  },

  addInvoice ({commit}, form) {
    return api(URI_INVOICE_CREATE, {
      method: 'POST',
      body: form
    })
  },

  updateInvoice ({commit}, form) {
    return api(UIR_INVOICE_UPDATE, {
      method: 'POST',
      body: form
    })
  },

  getInfo ({commit, dispatch}) {
    return api(URI_INVOICE_LIST, {method: 'GET'})
      .then(res => res.payload)
      .then((payload) => {
        if (payload.navbar) dispatch('updateNavbar', payload, { root: true })
        commit(types.SYNC, payload)
      })
  },

  previewDetial ({commit}, id) {
    return api(URI_INVOICE_DETAIL + '?id=' + id, {method: 'GET'})
      .then(res => res.payload)
      .then((payload) => {
        payload.invoice.invoice_type_text = payload.invoice_type === 1 ? '增值税普通发票' : '增值税专用发票'
        commit(types.PREVIEW_DETAIL, payload)
      })
  },

  delInvoice ({commit}, deleting) {
    return api(URI_INVOICE_CANCEL, {
      method: 'POST',
      body: {id: deleting.id}
    })
      .then((data) => {
        Message({
          message: data.payload.message,
          iconClass: 'qk-warning'
        })
        commit(types.SPLICE_INVOICE_DATA, deleting.index)
      })
      .catch(err => {
        Message({
          message: err.err_msg,
          iconClass: 'qk-warning'
        })
      })
  },

  getInvoiceDetail ({commit}, id) {
    return api(URI_INVOICE_DETAIL + '?id=' + id, {method: 'GET'})
      .then(res => res.payload)
      .then((payload) => {
        payload.id = id
        payload.invoice.invoice_type_text = payload.invoice_type === 1 ? '增值税普通发票' : '增值税专用发票'
        commit(types.INVOICE_DETAIL, payload)
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

