import request from '@/utils/request'
import qs from 'qs'

//查询所有角色
export function findAllRole() {
  return request({
    url: 'api/role/findAllRole',
    method: 'get',
  })
}

//根据id查询所有角色
export function findAllRoleByUser(id) {
  return request({
    url: `api/role/findAllRoleByUser/${id}`,
    method: 'get',
  })
}

//根据id查询用户，并根据rolesId分配角色
export function assignSelectRole(rolesId, id) {
  // let stringify = qs.stringify(rolesId);
  return request({
    url: `api/role/assignRole/${id}`,
    method: 'post',
    params: {rolesId:rolesId.join()}
  })
}

//根据params条件查询角色
export function getData(params) {
  return request({
    url: `api/role/getData`,
    method: 'get',
    params
  })
}

//根据role修改
export function updateRole(item) {
  return request({
    url: '/api/role',
    method: 'put',
    data: item
  })
}

//根据role保存
export function saveRole(item) {
  return request({
    url: '/api/role',
    method: 'post',
    data: item
  })
}

//根据id删除用户
export function deleteRole(id) {
  return request({
    url: `/api/role/${id}`,
    method: 'delete',
  })
}

//根据ids 删除用户
export function delBatchRole(ids) {
  return request({
    url: `/api/role/batchDelete`,
    method: 'delete',
    params: {ids: ids + ''}
  })
}

