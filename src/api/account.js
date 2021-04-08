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

// 个人信息
export function getPersonInfo() {
  return request({
    url: 'center/person',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
  })
}

// 应用信息
export function getClientInfo() {
  return request({
    url: 'center/client',
    method: 'get',
    headers: { 'Content-Type': 'x-www-form-urlencoded' },
  })
}

// 统一登录
export function changePassword(newPwd, origPwd) {
  return request({
    url: 'center/change/password',
    method: 'post',
    data: {
      newPwd: newPwd,
      origPwd: origPwd,
    },
  })
}
