/* eslint no-unused-vars: off */
import { Message } from 'element-ui'
import _ from 'lodash'

import {
  LW,
  L30D,
  L90D,
  URI_LOGOUT,
  URI_DASHBOARD,
  URI_REPORT,
  URI_REPORT_DOWNLOAD
} from '@/constants'

const types = {
  SYNC_DASHBOARD: 'sync_dashboard',
  SYNC_CHART: 'sync_chart',
  SYNC_TABLE: 'sync_table',
  SYNC_NAVBAR: 'sync_navbar'
}

const initState = () => ({
  indices: { // 依次为消费、展示、点击、完成
    last_day: [ // 昨天
      '0.00',
      0,
      0,
      0
    ],

    dby: [ // 前天
      '0.00',
      0,
      0,
      0
    ]
  },

  reportType: LW,

  // 图表数据
  chart: {
    data: [],
    labels: []
  },

  table: {
    data: [],
    summary: {
      cost: 0,
      impression: 0,
      clicks: 0,
      click_rate: '0.00%',
      effect_actions: 0,
      effect_rate: '0.00%',
      zs_done_count: 0,
      zs_finish_total_count: 0
    }
  }
})

const state = initState()

const getters = {
  indicesLastday: state => {
    return state.indices.last_day
  },

  indicesDBY: state => {
    return state.indices.dby
  },

  reportTypes: state => ([
    { label: '最近7天', value: LW },
    { label: '30天', value: L30D },
    { label: '90天', value: L90D }
  ]),

  reportSummary: state => {
    return state.table.summary
  },

  tableData: state => {
    return state.table.data
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

    // 首页汇总信息
    state.indices = payload.portlet
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
    return fetch(URI_DASHBOARD, {
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
      if (payload.navbar) dispatch('updateNavbar', payload, { root: true })
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
    let url = `${URI_REPORT}?action=chart&content=${content}&day_cnt=${dayCnt}&ts_start=${startTime}&ts_end=${endTime}`

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
    let url = `${URI_REPORT}?action=table&content=${content}&ts_start=${startTime}&ts_end=${endTime}`

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
    location.href = `${URI_REPORT_DOWNLOAD}?ts_start=${startTime}&ts_end=${endTime}`
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
