/* eslint no-unused-vars: off */
import { Message } from 'element-ui'
import _ from 'lodash'

import {
  LW,
  L30D,
  L90D,
  URI_LOGOUT,
  URI_HI_DASHBOARD,
  URI_HI_REPORT,
  URI_HI_REPORT_DOWNLOAD
} from '@/constants'

const types = {
  SYNC_DASHBOARD: 'sync_dashboard',
  SYNC_CHART: 'sync_chart',
  SYNC_TABLE: 'sync_table',
  SYNC_NAVBAR: 'sync_navbar'
}

const initState = () => ({
  navbar: {
    username: '',
    balance: '0.00',
    balance_threshold: '0.00'
  },

  // 消耗
  yesterday_amount: 0,
  sevendays_amount: 0,
  month_amount: 0,
  unliquidated: 0,

  reportType: LW,

  // 图表数据
  chart: {
    data: [],
    labels: []
  },

  table: {
    list: [],
    total: {
      cost: 0,
      seize: 0,
      finish_num: 0,
      finish_rate: '0.00%',
      compared_num: 0,
      compared_rate: '0.00%'
    }
  }
})

const state = initState()

const getters = {
  username: state => {
    return state.navbar.username
  },

  balance: state => {
    return state.navbar.balance
  },

  balanceThreshold: state => {
    return state.navbar.balance_threshold
  },

  consume: state => {
    return {
      yesterday_amount: state.yesterday_amount,
      sevendays_amount: state.sevendays_amount,
      month_amount: state.month_amount,
      unliquidated: state.unliquidated
    }
  },

  reportTypes: state => ([
    { label: '最近7天', value: LW },
    { label: '30天', value: L30D },
    { label: '90天', value: L90D }
  ]),

  reportSummary: state => {
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
    state.navbar = payload.navbar

    state.yesterday_amount = payload.yesterday_amount
    state.sevendays_amount = payload.sevendays_amount
    state.month_amount = payload.month_amount
    state.unliquidated = payload.unliquidated
  },

  [types.SYNC_CHART] (state, payload) {
    state.chart = payload
  },

  [types.SYNC_TABLE] (state, payload) {
    state.table = payload
  },

  [types.SYNC_NAVBAR] (state, payload) {
    state.navbar = payload.navbar
  }
}

const actions = {
  logout () {
    fetch(URI_LOGOUT, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(res => {
        $router.push('/login')
      })
      .catch(err => {
        Message({
          message: err.err_msg,
          iconClass: 'qk-warning'
        })
      })
  },

  getDashboardData ({ commit }) {
    return fetch(URI_HI_DASHBOARD, {
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
    let endTime = now - 86400
    let url = `${URI_HI_REPORT}?action=chart&content=${content}&day_cnt=${dayCnt}&ts_start=${startTime}&ts_end=${endTime}`

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
    let endTime = now - 86400
    let url = `${URI_HI_REPORT}?action=table&content=${content}&ts_start=${startTime}&ts_end=${endTime}`

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
    let endTime = now - 86400
    location.href = `${URI_HI_REPORT_DOWNLOAD}?ts_start=${startTime}&ts_end=${endTime}`
  },

  updateNavbar ({ commit }, payload) {
    commit(types.SYNC_NAVBAR, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
