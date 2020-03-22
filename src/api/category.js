import request from '@/utils/request'

export function getData(params) {
  return request({
    url: '/category/getData',
    method: 'get',
    params:params
  })
}

export function updCategory(data) {
  return request({
    url: '/category',
    method: 'put',
    data
  })
}

export function addCategory(params) {
  return request({
    url: '/category',
    method: 'post',
    data:params
  })
}

export function delCategory(id) {
  return request({
    url: `/category/${id}`,
    method: 'delete',
  })
}


export function delBatchCategory(ids) {
  return request({
    url: `/category/batchDelete`,
    method: 'delete',
    params:{
      ids:ids+""
    }
  })
}

export const IMPORT_CATEGORY = '/category/upload'