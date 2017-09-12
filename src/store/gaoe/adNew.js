import { URI_HI_TASK_SELECT_DATA, URI_HI_TASK, URI_HI_TASK_UPDATE } from '../../constants'
import api from '@/fetch'
const types = {
  SYNC_TASK: 'sync_task',
  SYNC_SELECT: 'sync_select'
}

const getters = {
}

const state = {
  adForm: {
    title: '', // 应用名称
    app_id: '', // 商户名称
    device: 'iOS',
    web_download_url: '',
    redirect_url: '', // 跳转地址（选填）
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    category: '',
    plan_count: '',
    univalent: '',
    platform: 0
  },
  merchantNameList: [{id: '1', title: 'sd'}], // 商户列表
  taskList: [{id: '2', title: 'sd'}] // 任务类型列表
}

const mutations = {
  [types.SYNC_TASK] (state, task) {
    let startDate = task.start_date + task.start_time
    let endDate = task.end_date + task.end_time
    let form = Object.assign({}, {...task}, {
      start_date: new Date(startDate),
      start_time: new Date(startDate),
      end_date: new Date(endDate),
      end_time: new Date(endDate)
    })

    state.adForm = form
  },

  [types.SYNC_SELECT] (state, select) {
    state.merchantNameList = select.app_list
    state.taskList = select.category_list
  }
}

const actions = {
  getSelectData (commit) {
    api(URI_HI_TASK_SELECT_DATA)
      .then(res => res.data && res.data.payload)
      .then((payload) => {
        console.log(payload)
      })
  },

  getTask ({commit}, taskId) {
    let uri = `${URI_HI_TASK}?id=${taskId}`
    api(uri).then(res => res.data && res.data.payload)
      .then(payload => {
        console.log('getTask.res:', payload)
      })
  },

  createTask ({commit}, task) {
    api(URI_HI_TASK, {
      method: 'POST',
      body: task
    }).then(res => {
      console.log('task create res:', res)
    })
  },

  updateTask ({commit}, task) {
    api(URI_HI_TASK_UPDATE, {
      method: 'POST',
      body: task
    }).then(res => {
      console.log('task create res:', res)
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
