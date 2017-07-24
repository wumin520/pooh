import Vue from 'vue'

function getFullscreen (vm) {
  const { fullscreen } = vm.$options
  if (fullscreen) {
    return typeof fullscreen === 'function'
      ? fullscreen.call(vm)
      : fullscreen
  }
}

Vue.mixin({
  mounted () {
    let root = document.documentElement
    let fullscreen = getFullscreen(this)
    if (fullscreen === true) {
      root.setAttribute('mode', 'fullscreen')
    } else if (fullscreen === false) {
      root.removeAttribute('mode')
    }
  }
})
