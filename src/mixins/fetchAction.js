import Vue from 'vue'

function getFetchAction (vm) {
  const { fetchAction } = vm.$options
  if (fetchAction) {
    return typeof fetchAction === 'function'
      ? fetchAction.call(vm)
      : fetchAction
  }
}

Vue.mixin({
  created () {
    let fetchAction = getFetchAction(this)
    if (fetchAction) this.$store.dispatch(fetchAction)
  }
})
