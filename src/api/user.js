import request from '@/utils/request'

// 新增用户信息
export function createUser(params) {
  return request({
    url: 'user/create',
    method: 'post',
    data: params,
  })
}

// 退出登录
export function Logout() {
  return request({
    url: '/api/account/logout',
    method: 'get',
    // headers: { "Content-Type": "x-www-form-urlencoded" },
  })
}
