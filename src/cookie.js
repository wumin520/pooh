const _get = (name) => {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/* 半小时过期 */
const _set = (name, value, days) => {
  var exp = new Date()
  exp.setTime(exp.getTime() + (days || 2) * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';path=/;expires=' + exp.toGMTString()
}

export default {
  get: _get,
  set: _set
}
