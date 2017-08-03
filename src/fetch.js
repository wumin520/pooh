
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
      var optBody = opt.body
      var stringBody = qs.stringify(opt.body)
      if (opt.special) {
        /*
          特殊的业务代码 ？？TODO 换种方法？？
          这里拦截body， 因为json无法添加两个key相同val不同的值
          但是添加广告、续单、编辑 提交时 需要特殊处理zs_task数组为如下格式, 否则专属的数据后端获取不到
            zs_task_the_day:1
            zs_task_money:1
            zs_task_the_day:2
            zs_task_money:1
            zs_task_the_day:3
            zs_task_money:1
            ...
        */
        let zsTask = optBody.zs_task
        zsTask.forEach(function (zt) {
          stringBody += '&zs_task_the_day=' + zt.the_day
          stringBody += '&zs_task_money=' + zt.money
        })

        opt.body = stringBody
      } else {
        opt.body = qs.stringify(opt.body)
      }
      opt.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    }
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
