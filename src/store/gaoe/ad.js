import {
  URI_HI_PREVIEW_TASK,
  URI_HI_TASK_TO_END,
  URI_HI_ADD_TASK_NUMBER,
  URI_HI_DELE_TASK,
  URI_HI_RESUME_TASK
 } from '@/constants'

import { Message } from 'element-ui'
import api from '@/fetch'
import _ from 'lodash'

const initState = () => ({
  totalTasks: 0, // 任务总数 for pagination
  searchForm: { // 按时间搜索时 选择的时间
    end_time: '',
    begin_time: ''
  },
  previewForm: {  // 预览表单的字段
    app_id: '',  // 商户名称
    title: '',  // 应用名称
    app_name: '', // 商户名称
    device: '', // 平台
    web_download_url: '', // 下载链接
    redirect_url: '', // 跳转链接
    category: '', // 任务类型
    plan_count: '', // 计划份数
    univalent: '0.00', // 单价
    begin_time: '', // 开始时间
    end_time: '',  // 结束时间
    category_name: ''
  },
  task_statcnt: { // 每个tab 的任务数
    ok: '',
    pending: '',
    rejected: '',
    paused: '',
    tocompare: '',
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
  SET_TABLE_DATA: 'set_table_data',
  SET_TASK_STATCNT: 'set_task_statcnt',
  UPDATE_PREVIEW_FORM: 'update_preview_form',
  SPLICE_TABLE_DATA: 'splice_table_data'
}

 // 更新应用状态
const mutations = {
  [types.SET_TASK_STATCNT] (state, taskStatcnt) {
    state.task_statcnt = taskStatcnt.taskStatcnt
    state.totalTasks = state.task_statcnt[taskStatcnt.status]
  },
  [types.SET_TABLE_DATA] (state, table) {
    state.tableData = table
  },
  [types.UPDATE_PREVIEW_FORM] (state, previewForm) {
    // state.previewForm = previewForm
    _.extend(state.previewForm, _.pick(previewForm, _.keys(state.previewForm)))
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
        if (config.currentStatus === payload.status) {
          commit(types.SET_TABLE_DATA, payload.task_list)
          let statcnt = {
            taskStatcnt: payload.task_statcnt,
            status: config.status
          }
          commit(types.SET_TASK_STATCNT, statcnt)
        }
      })
  },
  taskToEnd ({commit}, id) {
    let path = URI_HI_TASK_TO_END + '?id=' + id
    return api(path, {method: 'GET'})
      .then(res => res)
      .catch(e => {
        Message({
          message: e.err_msg,
          iconClass: 'qk-warning'
        })
      })
  },

  addTaskNumber ({ commit }, config) {
    return api(URI_HI_ADD_TASK_NUMBER, {
      method: 'POST',
      body: config
    }).then((res) => {
      window.location.reload()
    }).catch(e => {
      Message({
        message: e.err_msg,
        iconClass: 'qk-warning'
      })
    })
  },
  previewTask ({commit}, id) {
    api(URI_HI_PREVIEW_TASK + '?id=' + id, {method: 'GET'})
      .then(res => res && res.payload.task[0])
      .then((task) => {
        task.begin_time = task.start_date.replace(/-/g, '/') + ' ' + task.start_time
        task.end_time = task.end_date.replace(/-/g, '/') + ' ' + task.end_time
        task.device === 3 ? task.device = 'iOS' : task.device = 'Android'
        commit(types.UPDATE_PREVIEW_FORM, task)
      })
  },

  deleTask ({commit}, deleting) {
    return api(URI_HI_DELE_TASK + '?id=' + deleting.id, {method: 'GET'})
      .then((data) => {
        Message({
          message: data.payload.message,
          iconClass: 'qk-warning'
        })
        commit(types.SPLICE_TABLE_DATA, deleting.index)
      })
  },

  // exportIDFA ({commit}, config) {
  //   return api(URI_ADD_TASK_NUMBER + config.id + '/' + config.type + '/statistics/download', {method: 'GET'})
  //     .then(res => res.payload)
  //     .then((data) => {
  //       return data
  //     })
  // },

  resume ({commit}, id) {
    return api(URI_HI_RESUME_TASK + '?id=' + id, {method: 'GET'})
      .then(res => res)
      .catch(e => {
        Message({
          message: e.err_msg,
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
