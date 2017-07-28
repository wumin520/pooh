import {
  URI_ADDTASK_PRE,
  URI_ADDTASK
} from '@/constants'

import { Message } from 'element-ui'
import api from '@/fetch'

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
    remain_count: 100  // 添加的关键字列表 剩余可分配数
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
  SET_ADDTASK_PRE: 'set_addtask_pre',
  UPDATE_REMAIN_COUNT: 'update_remain_count',
  UPDATE_KEYWORDS_LIST: 'update_keywords_list',
  UPDATE_ZS_LISTS: 'update_zs_lists',
  REMOVE_ZS_ITEM: 'remove_zs_item',
  REMOVE_KEYWORDS_ITEM: 'remove_keywords_item'
}

// 更新应用状态
const mutations = {
  [types.SET_ADDTASK_PRE] (state, payload) {
    state.advertiser_id = payload.advertiser_id
    state.zs_free = payload.zs_free
    state.ad_price = payload.ad_price
  },

  [types.UPDATE_REMAIN_COUNT] (state, remain) {
    state.adForm.remain_count = remain
  },

  [types.UPDATE_KEYWORDS_LIST] (state, keywordsItem) {
    console.log('addKeyWordList')
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
  }
}

// 在 数据获取 完成后会调用 commit()来调用mutations更改 Store 中的状态。可以在组件中使用dispatch来发出 Actions。
const actions = {
  addtaskPre ({commit}) {
    return api(URI_ADDTASK_PRE, {method: 'GET'})
      .then(res => res && res.payload)
      .then(payload => {
        commit(types.SET_ADDTASK_PRE, payload)
      })
  },

  postForm ({commit}, postData) {
    return api(URI_ADDTASK, {method: 'post', body: postData})
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
          Message('您最多只能添加20个关键词')
          return
        }
        commit(types.UPDATE_KEYWORDS_LIST, iniItem)
      } else {
        // 到关键词限制
        Message('当前份数只能支持' + count + '份,计划份数150加一个关键词')
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
    if (state.adForm.plan_count !== '' && state.adForm.plan_count >= 5000 && state.zs_free === 1) {
      freeFlg = true
    }

    for (var i = 0; i < state.adForm.zs_task.length; i++) {
      state.adForm.zs_task[i].can_delete = false
    }
    if (state.adForm.zs_task.length === 0) {
      canDelete = true
      var item1 = {
        the_day: '1',
        free: freeFlg,
        key: Date.now(),
        can_delete: canDelete
      }
      commit(types.UPDATE_ZS_LISTS, item1)
    } else {
      var item2 = {
        the_day: '0',
        free: false,
        key: Date.now(),
        can_delete: true
      }
      commit(types.UPDATE_ZS_LISTS, item2)
    }
  },

  // 删除专属任务
  removeZSItem ({commit}, itemKey) {
    commit(types.REMOVE_ZS_ITEM, itemKey)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
