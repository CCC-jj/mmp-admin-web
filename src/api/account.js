import request from '@/utils/request'

// 统一登录
export function Login(sign, timestamp, loginType, mobile, password) {
  return request({
    url: 'union/login',
    method: 'post',
    headers: { sign: sign, timestamp: timestamp },
    data: {
      loginType: loginType,
      mobile: mobile,
      password: password,
    },
  })
}

// 修改密码
export function changePassword(oldPassword, password) {
  return request({
    url: '/api/account/changePassword',
    method: 'post',
    data: {
      oldPassword: oldPassword,
      password: password,
    },
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
