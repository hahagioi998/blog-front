import request from '@/utils/request'

export function getDataForName(params) {
  return request({
    url: 'tobs/tiaoxiang/txradar',
    method: 'get',
      params: params
  })
}


export function  getDataFirst(params) {
    return  request({
        url: 'tobs/tiaoxiang/cre_conditions_tx',
        method: 'get',
        params
    })
}