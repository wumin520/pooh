import {
  URI_FETCH_NEW_PRE,
  URI_POST_TASK,
  URI_FETCH_EDIT_PRE,
  URI_FETCH_RENEW_PRE,
  URI_CHECK_APPID
} from '@/constants'

import { Message } from 'element-ui'
import api from '@/fetch'
import _ from 'lodash'
import util from '@/utils'

const initState = () => ({
  advertiser_id: 0, // 广告主id for 限制添加关键词
  zs_free: 0, // 标识专属任务是否免费 1免费 0付费
  adForm: {
    title: 'a',
    download_url: 'aa',
    click_notify_url: 'aaa',
    search_keyword: '', // 为兼容老版 单关键词 for 续单、编辑
    begin_time: '',  // 日期
    begin_time_time: new Date(2017, 1, 1, 0, 0), // 时间
    end_time: '',  // 日期
    end_time_time: new Date(2017, 1, 1, 0, 0), // 时间
    plan_count: '300', // 计划分数
    plan_type: '按投放比例', // 关键词的设置类型 ’按投放比例‘ ’按计划份数‘
    planlist: [], // 关键词列表 [{keyTime:'k1',key:''}],// [{keyTime:'k1',key:'美容'},{keyTime:'k2',key:'交通'}]
    appstore_type: '免费', // 应用价格 ‘免费’  ’付费‘
    appstore_cost: '0.000', // 应用付费时的appstore价格
    platform: '仅 iPhone', // 仅 iPhone 仅 iPad 两者都是
    zs_task: [],  // 专属任务列表

    kw_flag_needed: '0', // 告诉后台 是否有关键词
    zs_task_needed: '0', // 告诉后台 是否有专属任务
    remain_count: 100,  // 添加的关键字列表 剩余可分配数
    appid: 'a',
    isNew: false // 是否新品app
  },
  ad_price: {  // 任务价格  unit_price:应用免费单价    unit_price_level2:应用付费单价   zs_unit_price：未知数据？？？
    unit_price: 0,
    unit_price_level2: '8.00',
    zs_unit_price: '0'
  }
})

// 应用状态
const state = initState()

// 允许组件从 Store 中获取数据 做简单的处理成新的字段
const getters = {
  // TODO:
}

const types = {
  RESET_FORM: 'reset_form',
  SET_NEW_TASK_PRE: 'set_new_task_pre',
  UPDATE_REMAIN_COUNT: 'update_remain_count',
  UPDATE_ADFORM: 'update_adform',
  UPDATE_KEYWORDS_LIST: 'update_keywords_list',
  UPDATE_ZS_LISTS: 'update_zs_lists',
  REMOVE_ZS_ITEM: 'remove_zs_item',
  REMOVE_KEYWORDS_ITEM: 'remove_keywords_item',
  IS_NEW_APPID: 'is_new_appid'
}

// 更新应用状态
const mutations = {
  [types.RESET_FORM] (state) {
    state.adForm = {
      title: '',
      download_url: '',
      click_notify_url: '',
      search_keyword: '',
      begin_time: '',
      begin_time_time: new Date(2017, 1, 1, 0, 0),

      end_time: '',
      end_time_time: new Date(2017, 1, 1, 0, 0),
      plan_count: '',
      plan_type: '按投放比例',
      planlist: [],
      appstore_type: '免费',
      appstore_cost: '0.000',
      platform: '仅 iPhone',
      zs_task: [],

      kw_flag_needed: '0',
      zs_task_needed: '0',
      remain_count: 100,
      showKeyWordsMessage: false, // 控制关键词提示Message弹层，消失后才允许第二次出现
      appid: '',
      isHasBindMobile: false,
      isNew: false // 是否新品app
    }
  },

  [types.SET_NEW_TASK_PRE] (state, payload) {
    state.advertiser_id = payload.advertiser_id
    state.zs_free = payload.zs_free
    state.ad_price = payload.ad_price
  },

  [types.UPDATE_ADFORM] (state, form) {
    state.adForm = {...form, isNew: false, isHasBindMobile: false}
  },

  [types.UPDATE_REMAIN_COUNT] (state, remain) {
    state.adForm.remain_count = remain
  },

  [types.UPDATE_KEYWORDS_LIST] (state, keywordsItem) {
    state.adForm.planlist.push(keywordsItem)
  },

  [types.UPDATE_ZS_LISTS] (state, zsItem) {
    state.adForm.zs_task.push(zsItem)
  },

  [types.REMOVE_ZS_ITEM] (state, zsItemKey) {
    var _temporary = []
    var _key = zsItemKey

    for (var i = 0; i < state.adForm.zs_task.length; i++) {
      var _t = state.adForm.zs_task[i]
      if (i === (state.adForm.zs_task.length - 2)) {
        _t.can_delete = true
      }
      if (_t.key !== _key) {
        _temporary.push(_t)
      }
    }
    state.adForm.zs_task = _temporary
  },

  [types.REMOVE_KEYWORDS_ITEM] (state, keywordsItemKey) {
    var _temporary = []
    for (var i = 0; i < state.adForm.planlist.length; i++) {
      var _t = state.adForm.planlist[i]
      if (_t.keyTime !== keywordsItemKey) {
        _temporary.push(_t)
      }
    }
    state.adForm.planlist = _temporary
  },

  [types.IS_NEW_APPID] (state, {isNew, isHasBindMobile}) {
    state.adForm.isNew = isNew
    state.adForm.isHasBindMobile = isHasBindMobile
  }
}

// 在 数据获取 完成后会调用 commit()来调用mutations更改 Store 中的状态。可以在组件中使用dispatch来发出 Actions。
const actions = {
  fetchPreNew ({dispatch, commit}) {
    return api(URI_FETCH_NEW_PRE, {method: 'GET'})
      .then(res => res && res.payload)
      .then(payload => {
        if (payload.navbar) dispatch('user/updateNavbar', payload, { root: true })
        commit(types.SET_NEW_TASK_PRE, payload)
        commit(types.RESET_FORM)
      })
  },

  fetchPreRenew ({dispatch, commit}, taskId) {
    let path = URI_FETCH_RENEW_PRE + taskId
    return api(path, {method: 'GET'})
      .then(res => res && res.payload)
      .then(payload => {
        if (payload.navbar) dispatch('user/updateNavbar', payload, { root: true })
        dispatch('formatPreInfoForEditAndRenew', payload)
      })
      .catch(err => {
        console.log('adnew err', err)
      })
  },

  fetchPreEdit ({dispatch, commit}, taskId) {
    let path = URI_FETCH_EDIT_PRE + taskId
    return api(path, {method: 'GET'})
      .then(res => res && res.payload)
      .then(payload => {
        if (payload.navbar) dispatch('user/updateNavbar', payload, { root: true })
        dispatch('formatPreInfoForEditAndRenew', payload)
      })
  },

  formatPreInfoForEditAndRenew ({commit}, payload) {
    let info = {
      advertiser_id: payload.advertiser_id,
      ad_price: payload.task.ad_price,
      zs_free: payload.zs_free
    }
    commit(types.SET_NEW_TASK_PRE, info)
    _.forEach(payload.task.zs_task, function (n) {
      n.univalent === 0 ? n.free = true : n.free = false
    })
    // 有单关键词 没有多关键词
    if (!!payload.task.search_keyword && payload.task.planlist.length === 0) {
      payload.task.planlist.push({
        key: payload.task.search_keyword,
        num: '100',
        keyTime: Date.now()
      })
    }

    for (var i = 0; i < payload.task.planlist.length; i++) {
      payload.task.planlist[i].keyTime = Date.now() + i
    }
    parseInt(payload.task.platform) === 1 ? payload.task.platform = '仅 iPhone' : (parseInt(payload.task.platform) === 2 ? payload.task.platform = '仅 iPad' : payload.task.platform = '两者都是')
    payload.task.appstore_type === 0 ? payload.task.appstore_type = '免费' : payload.task.appstore_type = '付费'
    payload.task.plan_type = '按投放比例'
    payload.task.remain_count = 0

    var hh = util.formatTime(payload.task.begin_time).substr(11, 2)
    var mm = util.formatTime(payload.task.begin_time).substr(14, 2)
    payload.task.begin_time_time = new Date(2016, 9, 10, hh, mm, 0)

    hh = util.formatTime(payload.task.end_time).substr(11, 2)
    mm = util.formatTime(payload.task.end_time).substr(14, 2)
    payload.task.end_time_time = new Date(2016, 9, 10, hh, mm, 0)

    payload.task.begin_time = util.formatTime(payload.task.begin_time).substr(0, 10)
    payload.task.end_time = util.formatTime(payload.task.end_time).substr(0, 10)

    for (let i = 0; i < payload.task.zs_task.length; i++) {
      let item = payload.task.zs_task[i]
      payload.task.zs_task[i].key = Date.now() + i
      item.can_delete = false
      payload.task.zs_task[payload.task.zs_task.length - 1].can_delete = true
    }

    // console.log('>>>payload.task.zs_task', payload.task.zs_task)
    commit(types.UPDATE_ADFORM, payload.task)
  },

  postForm ({commit}, config) {
    let path = URI_POST_TASK
    config.routeName === 'dash_ad_edit' ? path = '/v2/api/task/' + config.params : (config.routeName === 'dash_ad_renew' ? path = '/v2/api/task/copy/' + config.params : path = '/v2/api/task')
    return api(path, {method: 'post', special: true, body: config.postData})
      .then(res => res && res.payload)
      .then(payload => {
        return payload
      })
  },

   // 恢复关键词初始状态
  rePlanAnalysis ({dispatch, commit, state}) {
    var planlist = state.adForm.planlist
    planlist.forEach(function (p) {
      p.num = ''
    })
    dispatch('planAnalysis')
  },

  // 计划分数改变 对关键词剩余比例、剩余分数的影响
  planAnalysis ({commit, state}) {
    var sum = 0
    var remain = state.adForm.plan_count
    var planlist = state.adForm.planlist
    planlist.forEach(function (p) {
      if (typeof (p.num) !== 'undefined' && !isNaN(parseInt(p.num))) {
        sum += parseInt(p.num)
      }
    })
    if (state.adForm.plan_type === '按投放比例') {
      if (sum >= 100) {
        remain = 0
      } else {
        remain = 100 - sum
      }
    } else {
      if (sum >= remain) {
        remain = 0
      } else {
        remain = remain - sum
      }
    }
    commit(types.UPDATE_REMAIN_COUNT, remain)
  },

  addKeyWordList ({commit, state}) {
    // 按计划 可添加的关键词个数
    var count = Math.floor(state.adForm.plan_count / 150)
    var iniItem = {
      key: '',
      num: '',
      keyTime: Date.now()
    }
    if (state.advertiser_id === 45) {
      // 用户45 可无限制添加关键词
      commit(types.UPDATE_KEYWORDS_LIST, iniItem)
    } else {
      // 可添加关键词数 < count &&  < 20
      if (state.adForm.planlist.length < count) {
        // 已添加的关键字个数
        var total = state.adForm.planlist.length
        if (total >= 20) {
          Message({
            message: '您最多只能添加20个关键词',
            iconClass: 'qk-warning'
          })
          return
        }
        commit(types.UPDATE_KEYWORDS_LIST, iniItem)
      } else {
        if (state.showKeyWordsMessage) {
          return
        } else {
          state.showKeyWordsMessage = true
          // 到关键词限制
          Message({
            message: '当前份数只能支持' + count + '份,计划份数150加一个关键词',
            iconClass: 'qk-warning',
            onClose: function (m) {
              state.showKeyWordsMessage = false
            }
          })
        }
      }
    }
  },

  removeKeyWordsItem ({commit}, itemKeyTime) {
    commit(types.REMOVE_KEYWORDS_ITEM, itemKeyTime)
  },

  // 添加专属任务
  addZSLists ({commit, state}) {
    var canDelete = false
    var freeFlg = false
    var money = 1
    if (state.adForm.plan_count !== '' && state.adForm.plan_count >= 5000 && state.zs_free === 1) {
      freeFlg = true
      money = 0
    }

    for (var i = 0; i < state.adForm.zs_task.length; i++) {
      state.adForm.zs_task[i].can_delete = false
    }
    if (state.adForm.zs_task.length === 0) {
      canDelete = true
      var item1 = {
        the_day: '1',
        free: freeFlg,
        money: money,
        key: Date.now(),
        can_delete: canDelete
      }
      commit(types.UPDATE_ZS_LISTS, item1)
    } else {
      var item2 = {
        the_day: '0',
        free: false,
        money: money,
        key: Date.now(),
        can_delete: true
      }
      commit(types.UPDATE_ZS_LISTS, item2)
    }
  },

  // 删除专属任务
  removeZSItem ({commit}, itemKey) {
    commit(types.REMOVE_ZS_ITEM, itemKey)
  },

  // 判断广告主是否绑定手机和appid是否是新品
  checkAppId ({commit}, appid) {
    let uri = `${URI_CHECK_APPID}?appid=${appid}`
    return api(uri).then((res) => {
      let payload = res.payload
      let isNew = false
      if (payload.code === 20004) {
        isNew = true
      }
      if (payload.code === 20001 || payload.code === 20002) {
        Message({
          message: payload.msg,
          iconClass: 'qk-warning'
        })
      }
      commit(types.IS_NEW_APPID, {isNew, isHasBindMobile: payload.mobile})
      return {isNew}
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
