import request from '@/utils/request'
import qs from 'qs'
export function findAllRole() {
  return request({
    url: 'api/role/findAllRole',
    method: 'get',
  })
}

export function findAllRoleByUser(id) {
  return request({
    url: `api/role/findAllRoleByUser/${id}`,
    method: 'get',
  })
}

export function assignSelectRole(rolesId, id) {
  // let stringify = qs.stringify(rolesId);
  return request({
    url: `api/role/assignRole/${id}`,
    method: 'post',
    params: {rolesId:rolesId.join()}
  })
}
