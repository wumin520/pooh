/* eslint-disable */
const _clone = (obj) => {
  // Handle the 3 simple types, and null or undefined
  if (obj === null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) {
    const copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    const copy = []
    for (var i = 0; i < obj.length; i++) {
      copy[i] = _clone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    const copy = {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = _clone(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

/* 格式化时间戳为 yyyy-MM-dd hh:mm:ss */
const _formatTime = (timestamp, format) => {
  const date = new Date(timestamp * 1000)
  const yyyy = date.getFullYear()
  const MM = (date.getMonth() + 101 + '').slice(1)
  const dd = (date.getDate() + 100 + '').slice(1)
  const hh = (date.getHours() + 100 + '').slice(1)
  const mm = (date.getMinutes() + 100 + '').slice(1)
  const ss = (date.getSeconds() + 100 + '').slice(1)

  if (format === 'hh') {
    return hh
  }

  if (format === 'mm') {
    return mm
  }

  if (format === 'yyyy-MM-dd') {
    return yyyy + '-' + MM + '-' + dd
  }

  if (format === 'yyyy-MM-dd_zh') {
    return yyyy + '年' + MM + '月' + dd + '日'
  }

  if (format === 'yyyy.MM.dd hh:mm') {
    return yyyy + '.' + MM + '.' + dd + ' ' + hh + ':' + mm
  }

  return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
}

/* eslint-enable */

export default {
  clone: _clone,
  formatTime: _formatTime
}
