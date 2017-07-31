import {
 URI_TASK_TO_END,
 URI_ADD_TASK_NUMBER,
 URI_PREVIEW_TASK,
 URI_DELE_TASK,
 URI_RESUME_TASK
} from '@/constants'

import { Message } from 'element-ui'
import api from '@/fetch'
import _ from 'lodash'
import util from '@/utils'

const initState = () => ({
  afterSearch: false, // 标识搜索是否已经结束  ？todo 检查是否多余？
  currentPage: 1, // 当前在第几页 for pagination
  totalTasks: 0, // 任务总数 for pagination
  searchSelect: 'time', // 搜索的条件： time + title  默认按时间搜索
  searchForm: { // 按时间搜索时 选择的时间
    end_time: '',
    begin_time: ''
  },
  count: 0, // 存在两个相同pagination，这里记录 pagination 点击次数， 防止发送多次请求
  previewForm: {  // 预览表单的字段
    title: '',
    download_url: '',
    click_notify_url: '',
    search_keyword: '',
    begin_time: '',
    end_time: '',
    plan_count: '',
    appstore_type: '免费',
    appstore_cost: '',
    kw_flag_needed: '0',
    planlist: [],
    zs_task_needed: '0',
    zs_task: [],
    platform: '只在iPhone显示'
  },
  ad_price: { // 任务的单价 预览时获取
    unit_price: '',
    unit_price_level2: '',
    zs_unit_price: ''
  },
  task_statcnt: { // 每个tab 的任务数
    ok: '',
    pending: '',
    rejected: '',
    paused: '',
    ended: ''
  },
  tableData: []
})

// 应用状态
const state = initState()

// 允许组件从 Store 中获取数据 做简单的处理成新的字段
const getters = {
  // TODO:
}

const types = {
  // CHANGE_LOADIG_STATUS: 'change_loading_status',
  CHANGE_COUNT_STATUS: 'change_count_status',
  CHANGE_AFTERSEARCH_STATUS: 'change_aftersearch_status',
  RESET_TABLE_DATA: 'reset_table_data',
  SET_TABLE_DATA: 'set_table_data',
  SET_TASK_STATCNT: 'set_task_statcnt',
  UPDATE_AD_PRICE: 'update_ad_price',
  UPDATE_PREVIEW_FORM: 'update_preview_form',
  SPLICE_TABLE_DATA: 'splice_table_data'
}

// 更新应用状态
const mutations = {
  // [types.CHANGE_LOADIG_STATUS] (state, loading) {
  //   state.loading = loading
  // },
  [types.CHANGE_COUNT_STATUS] (state, count) {
    state.count = count
  },
  [types.CHANGE_AFTERSEARCH_STATUS] (state, afterSearch) {
    state.afterSearch = afterSearch
  },
  [types.SET_TASK_STATCNT] (state, taskStatcnt) {
    state.task_statcnt = taskStatcnt.taskStatcnt
    state.totalTasks = state.task_statcnt[taskStatcnt.status]
  },
  [types.CHANGE_DIALOG_SEARCH_VISIBLE] (state, visible) {
    state.dialogSearchVisible = visible
  },
  [types.SET_TABLE_DATA] (state, table) {
    state.tableData = table
    _.forEach(state.tableData, function (n) {
      n.begin_time = util.formatTime(n.begin_time, 'yyyy-MM-dd hh:mm')
      n.end_time = util.formatTime(n.end_time, 'yyyy-MM-dd hh:mm')
    })
  },
  [types.RESET_TABLE_DATA] (state) {
    // state.tableData = []
  },
  [types.CHANGE_CURRENT_PAGE] (state, currentPage) {
    state.currentPage = currentPage
  },
  [types.UPDATE_AD_PRICE] (state, adPrice) {
    state.ad_price = adPrice
  },
  [types.UPDATE_PREVIEW_FORM] (state, previewForm) {
    state.previewForm = previewForm
  },
  [types.SPLICE_TABLE_DATA] (statet, index) {
    state.tableData.splice(index, 1)
  }
}

// 在 数据获取 完成后会调用 commit()来调用mutations更改 Store 中的状态。可以在组件中使用dispatch来发出 Actions。
const actions = {
  searchAdTask ({dispatch, commit, state}, config) {
    return api(config.url, {method: 'GET'})
      .then(res => res && res.payload)
      .then(payload => {
        console.log('>>>>', payload, config.currentStatus)
        // commit(types.CHANGE_LOADIG_STATUS, false)
        commit(types.CHANGE_COUNT_STATUS, 0)
        commit(types.CHANGE_AFTERSEARCH_STATUS, true)
        if (payload.navbar) dispatch('user/updateNavbar', payload, { root: true })

        if (config.currentStatus === payload.status) {
          commit(types.SET_TABLE_DATA, payload.tasks)
          let statcnt = {
            taskStatcnt: payload.task_statcnt,
            status: config.status
          }
          commit(types.SET_TASK_STATCNT, statcnt)
        }
        commit(types.CHANGE_DIALOG_SEARCH_VISIBLE, false)
        // state.set_operation_column_width()
      }).catch((e) => {
        // commit(types.CHANGE_LOADIG_STATUS, false)
        commit(types.CHANGE_AFTERSEARCH_STATUS, true)
      })
  },
  resetTableData ({commit}) {
    commit(types.RESET_TABLE_DATA)
  },
  changeCount ({commit, state}, val) {
    if (state.count > 0) {
      return
    }
    commit(types.CHANGE_COUNT_STATUS, state.count + 1) // ?这里要验证对不对?
    commit(types.CHANGE_CURRENT_PAGE, val)
  },
  taskToEnd ({commit}, id) {
    let path = URI_TASK_TO_END + id
    api(path, {method: 'GET'})
      .then(res => res && res.payload)
      .then((data) => {
        return data
      })
  },
  addTaskNumber ({commit}, config) {
    let url = URI_ADD_TASK_NUMBER + config.currentTaskId + '/add_number/' + config.addNumber
    api(url, {method: 'GET'})
      .then(res => res.payload)
      .then((data) => {
        window.location.reload()
      })
  },

  previewTask ({commit}, id) {
    api(URI_PREVIEW_TASK + id, {method: 'GET'})
      .then(res => res && res.payload)
      .then((payload) => {
        commit(types.UPDATE_AD_PRICE, payload.task.ad_price)
        _.forEach(payload.task.zs_task, function (n) {
          n.univalent === 0 ? n.free = true : n.free = false
        })
        _.forEach(payload.task.planlist, function (n) {
          n.keyTime = Date.now()
        })

        if (payload.task.planlist.length === 0) {
          if (payload.task.search_keyword !== '') {
            payload.task.planlist.push({key: payload.task.search_keyword, num: '100'})
          }
        }

        payload.task.platform === 1 ? payload.task.platform = '只在iPhone显示' : (payload.task.platform === 2 ? payload.task.platform = '只在iPad显示' : payload.task.platform = '两者都显示')
        payload.task.appstore_type === 0 ? payload.task.appstore_type = '免费' : payload.task.appstore_type = '付费'

        payload.task.begin_time = util.formatTime(payload.task.begin_time)
        payload.task.end_time = util.formatTime(payload.task.end_time)
        commit(types.UPDATE_PREVIEW_FORM, payload.task)
        console.log('state.previewForm', state.previewForm)
      })
  },

  deleTask ({commit}, deleting) {
    return api(URI_DELE_TASK + deleting.id, {method: 'GET'})
      .then((data) => {
        Message(data.message)
        commit(types.SPLICE_TABLE_DATA, deleting.index)
        // this.tableData.splice(deleting.index, 1)
      })
  },

  exportIDFA ({commit}, config) {
    return api(URI_ADD_TASK_NUMBER + config.id + '/' + config.type + '/statistics/download', {method: 'GET'})
      .then(res => res.payload)
      .then((data) => {
        return data
      })
  },

  resume ({commit}, id) {
    return api(URI_RESUME_TASK + id, {method: 'GET'})
      .then(res => res.data)
      .then((data) => {
        return data
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
