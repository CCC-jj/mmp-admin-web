import request from '@/utils/request'

// 字典列表
export function getDictList(params) {
  return request({
    url: 'system/dict/list',
    method: 'post',
    data: params,
  })
}

// 新增字典类型
export function addDictList(params) {
  return request({
    url: 'system/dict/list/add',
    method: 'post',
    data: params,
  })
}

// 编辑字典类型
export function editDictList(params) {
  return request({
    url: 'system/dict/list/edit',
    method: 'post',
    data: params,
  })
}

// 字典详情
export function getDictDetail(params) {
  return request({
    url: 'system/dict/detail',
    method: 'post',
    data: params,
  })
}

// 新增字典键值
export function addDictDetail(params) {
  return request({
    url: 'system/dict/detail/add',
    method: 'post',
    data: params,
  })
}

// 编辑字典键值
export function editDictDetail(params) {
  return request({
    url: 'system/dict/detail/edit',
    method: 'post',
    data: params,
  })
}