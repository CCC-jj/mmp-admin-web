import request from '@/utils/request'

// 搜索查询参数列表
export function getRoleList(params) {
  return request({
    url: 'auth/role/list',
    method: 'post',
    data: params,
  })
}

// 启用-禁用参数列表
export function activeRole(roleId) {
  return request({
    url: 'auth/role/active',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
    params: {
      roleId: roleId,
    },
  })
}

// 添加参数列表
export function addRoleList(params) {
  return request({
    url: 'auth/role/add',
    method: 'post',
    data: params,
  })
}
