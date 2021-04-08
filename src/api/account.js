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

// 统一登出
export function Logout(sign, timestamp) {
  return request({
    url: 'union/logout',
    method: 'get',
    headers: { sign: sign, timestamp: timestamp },
  })
}
