import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'api/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [function (data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: 'api/logout',
    method: 'post'
  })
}


export function add() {
  return request({
    url: '/api/user',
    method: 'post',
    data: [
      {"username": "freedom1", "password": "123"},
      {"username": "freedom1", "password": "123"},
      {"username": "freedom1", "password": "123"},
    ]
  })
}
