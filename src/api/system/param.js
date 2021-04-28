import request from '@/utils/request'

// 搜索查询参数列表
export function getParamList(params) {
  return request({
    url: 'system/param/list',
    method: 'post',
    data: params,
  })
}

// 启用-禁用参数列表
export function switchParam(paramKey) {
  return request({
    url: 'system/param/switch',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
    params: {
      paramKey: paramKey,
    },
  })
}

// 添加参数列表
export function addParamList(params) {
  return request({
    url: 'system/param/add',
    method: 'post',
    data: params,
  })
}