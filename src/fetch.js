
import qs from 'qs'
import 'whatwg-fetch'

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

    if (opt.method.toLowerCase() === 'post' && opt.body) {
      opt.body = qs.stringify(opt.body)
      opt.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
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
        return err.response
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