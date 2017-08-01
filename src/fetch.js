
import qs from 'qs'
import 'whatwg-fetch'
import {Message} from 'element-ui'

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

const api = (url, options) => {
  const defer = new Promise((resolve, reject) => {
    let opt = options || {}

    if (opt.method && opt.method.toLowerCase() === 'post' && opt.body) {
      opt.body = qs.stringify(opt.body)
      opt.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    }
    // application/json
    if (opt.method && opt.method.toLowerCase() === 'get') {
      opt.headers = {'Content-Type': 'application/json'}
    }

    fetch(url, {credentials: 'same-origin', ...opt})
      .then(checkStatus)
      .then(response => {
        return response.json()
      })
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        if (err.response.status === 400) {
          return err.response
        } if (err.response.status === 401) {
          Message('请先登录！')
          $router.push('/')
          return
        } else {
          Message({type: 'error', message: '服务器内部错误，请稍后重试！'})
        }
      })
      .then(err => {
        if (err) {
          return err.json()
        }
      }).then(err => {
        reject(err)
      })
  })
  return defer
}

export default api
