import { URI_HI_TASK_SELECT_DATA, URI_HI_TASK, URI_HI_TASK_CREATE, URI_HI_TASK_UPDATE } from '../../constants'
import api from '@/fetch'
const types = {
  SYNC_TASK: 'sync_task',
  SYNC_SELECT: 'sync_select',
  INIT_ADFORM: 'init_state'
}

const getters = {
}

const state = {
  adForm: {
    title: '', // 应用名称
    app_id: '', // 商户名称
    device: '',
    web_download_url: '',
    redirect_url: '', // 跳转地址（选填）
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    category: '',
    plan_count: '',
    univalent: ''
  },
  merchantNameList: [], // 商户列表
  taskList: [], // 任务类型列表
  platformList: [] // 投放平台
}

const mutations = {
  [types.SYNC_TASK] (state, task) {
    let startDate = task.start_date + ' ' + task.start_time
    let endDate = task.end_date + ' ' + task.end_time
    let form = Object.assign({}, {...task}, {
      start_date: new Date(startDate),
      start_time: new Date(startDate),
      end_date: new Date(endDate),
      end_time: new Date(endDate)
    })
    form.category = form.category.toString()
    state.adForm = form
  },

  [types.SYNC_SELECT] (state, select) {
    state.merchantNameList = select.app_list
    state.taskList = select.category_list
    state.platformList = select.device_list
    state.adForm.device = select.device_list[0].value
  },

  [types.INIT_ADFORM] (state) {
    state.adForm = {
      title: '', // 应用名称
      app_id: '', // 商户名称
      device: '',
      web_download_url: '',
      redirect_url: '', // 跳转地址（选填）
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      category: '',
      plan_count: '',
      univalent: ''
    }
  }
}

const actions = {
  getSelectData ({commit}) {
    // 目前只在创建新任务时获取
    api(URI_HI_TASK_SELECT_DATA)
      .then(res => res.payload)
      .then((payload) => {
        console.log(payload)
        commit(types.SYNC_SELECT, payload)
      })
  },

  getTask ({commit}, taskId) {
    let uri = `${URI_HI_TASK}?id=${taskId}`
    api(uri).then(res => res.payload)
      .then(payload => {
        console.log('getTask.res:', payload)
        commit(types.SYNC_SELECT, payload)
        commit(types.SYNC_TASK, payload.task[0])
      })
  },

  createTask ({commit}, task) {
    return api(URI_HI_TASK_CREATE, {
      method: 'POST',
      body: task
    }).then(res => {
      console.log('task create res:', res)
    })
  },

  updateTask ({commit}, task) {
    return api(URI_HI_TASK_UPDATE, {
      method: 'POST',
      body: task
    })
  },

  initAdForm ({commit}) {
    commit(types.INIT_ADFORM)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
