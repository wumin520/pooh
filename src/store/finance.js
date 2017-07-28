/* eslint no-unused-vars: off */
import { Message } from 'element-ui'

const types = {
  SYNC: 'sync'
}

const initState = () => ({
  tableData: [],
  summary: {
    today_cost: 0,
    yesterday_cost: 0,
    sevenday_coast: 0,
    thirtyday_coast: '0',
    remainder: 0,
  }
})

const state = initState()

const mutations = {
  [types.SYNC] (state, payload) {
    state.tableData = payload.payments
    state.summary.today_cost = payload.cost.cost_00
    state.summary.yesterday_cost = payload.cost.cost_01
    state.summary.sevenday_coast = payload.cost.cost_07
    state.summary.thirtyday_coast = payload.cost.cost_30
    state.summary.remainder = payload.cost.balance
  }
}

const action = {
  fetch () {

  }
}
