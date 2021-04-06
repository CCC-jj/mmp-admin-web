import request from '@/utils/request'

// 客户端列表
export function getClientList(params) {
  return request({
    url: 'client/list',
    method: 'post',
    data: params,
  })
}

// 添加客户端信息
export function createClient(params) {
  return request({
    url: 'client/create',
    method: 'post',
    data: params,
  })
}

// 修改客户端信息
export function modifyClient(params) {
  return request({
    url: 'client/modify',
    method: 'post',
    data: params,
  })
}

// 禁用-启用客户端
export function disableClient(clientId) {
  return request({
    url: 'client/disable',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
    params: {
      clientId: clientId,
    },
  })
}

// 获取客户端和用户列表及授权关系
export function userClient(clientId) {
  return request({
    url: 'client/user',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
    params: {
      clientId: clientId,
    },
  })
}