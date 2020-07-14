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

export function getData(params) {
  return request({
    url: 'api/user/getData',
    method: 'get',
    params
  })
}

export function updateUser(item) {
  return request({
    url: '/api/user',
    method: 'put',
    data: item
  })
}

export function saveUser(item) {
  return request({
    url: '/api/user',
    method: 'post',
    data: item
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/user/${id}`,
    method: 'delete',
  })
}

export function delBatchUser(ids) {
  return request({
    url: `/api/user/batchDelete`,
    method: 'delete',
    params: {ids: ids + ''}
  })
}
