import {
  URI_INVOICE_LIST,
  URI_INVOICE_CANCEL,
  URI_INVOICE_PREVIEW,
  URI_INVOICE_CREATE
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
  invoice_title: [{ // 发票抬头
    id: '60',
    name: '这是公司一'
  }, {
    id: '61',
    name: '这是公司二'
  }],
  invoice_category: [
    {
      value: 1,
      name: '信息服务费'
    },
    {
      value: 2,
      name: '广告费'
    },
    {
      value: 3,
      name: '技术服务费'
    },
    {
      value: 4,
      name: '推广费'
    }
  ],
  // 开票提交的表单
  adForm: {
    invoice_type: 1, // 发票类型
    drawee_id: '', // 开票人
    amount: '3000', // 开票金额
    invoice_category: '', // 发票内容
    unified_social_credit_code: '', // 社会统一信用代码
    bank_name: '', // 开户银行
    bank_number: '', // 银行账号
    is_invoice_default: 0, // 是否保存为默认开票信息 0:否 1:是
    recipient_name: '', // 收件人姓名
    contact: '', // 手机号码
    address: '', // 收件地址
    remarks: '', // 备注信息
    is_address_default: 0 // 是否保存为默认寄送信息 0:否 1:是
  }
})

const types = {
  SYNC: 'sync',
  SPLICE_INVOICE_DATA: 'splice_invoice_data',
  PREVIEW_DETAIL: 'preview_detail'
}

const state = initState()

const getters = {}

const mutations = {
  [types.SYNC] (state, payload) {
    state.invoice_list = payload.invoice_list
    _.forEach(state.invoice_list, function (n) {
      n.invoice_type_text = n.invoice_type === 1 ? '增值税普通发票' : '增值税专用发票'
      n.status_text = n.status === 0 ? '待审核' : (n.status === 1 ? '审核通过' : '审核失败')
    })
  },

  [types.SPLICE_INVOICE_DATA] (state, index) {
    state.invoice_list.splice(index, 1)
  },

  [types.PREVIEW_DETAIL] (state, payload) {
    state.invoice = payload.invoice
    state.invoice_title = payload.invoice_title
    state.invoice_category = payload.invoice_category
  }
}

const actions = {
  addInvoice ({commit}, form) {
    return api(URI_INVOICE_CREATE, {
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
    return api(URI_INVOICE_PREVIEW + '?id=' + id, {method: 'GET'})
      .then(res => res.payload)
      .then((payload) => {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

