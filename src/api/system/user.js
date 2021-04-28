import request from '@/utils/request'

// 用户列表
export function getUserList(params) {
  return request({
    url: 'system/user/list',
    method: 'post',
    data: params,
  })
}

// 新增用户信息
export function createUser(params) {
  return request({
    url: 'system/user/create',
    method: 'post',
    data: params,
  })
}

// 变更用户状态
export function activeUser(userId) {
  return request({
    url: 'system/user/active',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
    params: {
      userId: userId,
    },
  })
}

// 查看用户信息
export function queryUser(userId) {
  return request({
    url: 'system/user/query',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
    params: {
      userId: userId,
    },
  })
}

// 重置密码
export function resetPassword(userId) {
  return request({
    url: 'system/user/reset/password',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
    params: {
      userId: userId,
    },
  })
}

// 获取授权角色
export function accreditRoleList() {
  return request({
    url: 'system/user/accredit/role/list',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
  })
}

// 角色授权
export function userAccreditRole(params) {
  return request({
    url: 'system/user/accredit/role',
    method: 'post',
    data: params,
  })
}
