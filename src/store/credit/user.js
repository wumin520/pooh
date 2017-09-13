/* eslint no-unused-vars: off */
import { Message } from 'element-ui'
import _ from 'lodash'

import {
  LW,
  L30D,
  L90D,
  URI_CREDIT_DASHBOARD,
  URI_CREDIT_REPORT,
  URI_CREDIT_REPORT_DOWNLOAD
} from '@/constants'

const types = {
  SYNC_DASHBOARD: 'sync_dashboard',
  SYNC_CHART: 'sync_chart',
  SYNC_TABLE: 'sync_table',
  SYNC_NAVBAR: 'sync_navbar'
}

const initState = () => ({
  unliquidated: '',
  yesterday_amount: '',
  sevendays_amount: '',
  month_amount: '',
  reportType: LW,

  // 图表数据
  chart: {
    data: [],
    labels: []
  },

  table: {
    data: [],
    total: {
      cost: 0,
      loan_succ_num: 0,
      register_num: 0
    }
  }
})

const state = initState()

const getters = {
  reportTypes: state => ([
    { label: '最近7天', value: LW },
    { label: '30天', value: L30D },
    { label: '90天', value: L90D }
  ]),

  reportTotal: state => {
    return state.table.total
  },

  tableData: state => {
    return state.table.list
  },

  chartLabels: state => {
    let labels = []
    _.each(state.chart.labels, l => {
      if (l.substr(0, 1) === '0') l = l.substring(1)
      labels.push(l.replace('-', '月') + '日')
    })

    return labels
  },

  chartData: state => {
    return state.chart.data
  }
}

const mutations = {
  [types.SYNC_DASHBOARD] (state, payload) {
    // 用户名、余额、最大可透支金额
    // state.navbar = payload.navbar
    state.unsettled_amount = payload.unsettled_amount
    state.yesterday_amount = payload.yesterday_amount
    state.sevendays_amount = payload.sevendays_amount
    state.month_amount = payload.month_amount
  },

  [types.SYNC_CHART] (state, payload) {
    state.chart = payload
  },

  [types.SYNC_TABLE] (state, payload) {
    state.table = payload
  }
}

const actions = {
  getDashboardData ({ commit, dispatch }) {
    return fetch(URI_CREDIT_DASHBOARD, {
      credentials: 'same-origin'
    })
      .then(res => {
        if (res.status === 401) {
          $router.push('/login')
        } else {
          return res
        }
      })
      .then(res => res.json())
      .then(data => {
        let payload = data && data.payload
        if (payload) commit(types.SYNC_DASHBOARD, payload)
        if (payload.navbar) dispatch('updateNavbar', payload, { root: true })
        return data
      })
      .catch(err => {
        console.log(err)
      })
  },

  getChartData ({ commit }, payload) { // 按天数、按指标类型取图表数据
    let { content, dayCnt } = payload
    let now = parseInt((new Date()).getTime() / 1000)
    let startTime = now - dayCnt * 86400
    let endTime = now
    let url = `${URI_CREDIT_REPORT}?action=chart&content=${content}&start_time=${startTime}&end_time=${endTime}`

    return fetch(url, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        let payload = data && data.payload
        commit(types.SYNC_CHART, payload)
        return data
      })
  },

  getTableData ({ commit }, payload) {
    let { content, dayCnt } = payload
    let now = parseInt((new Date()).getTime() / 1000)
    let startTime = now - dayCnt * 86400
    let endTime = now
    let url = `${URI_CREDIT_REPORT}?action=table&content=${content}&start_time=${startTime}&end_time=${endTime}`

    return fetch(url, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        let payload = data && data.payload
        commit(types.SYNC_TABLE, payload)
        return data
      })
  },

  downloadReport (ctx, payload) {
    let { dayCnt } = payload
    let now = parseInt((new Date()).getTime() / 1000)
    let startTime = now - dayCnt * 86400
    let endTime = now
    location.href = `${URI_CREDIT_REPORT_DOWNLOAD}?start_time=${startTime}&end_time=${endTime}`
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
