import request from '@/utils/request'

// 健康卡查询记录
export function getAppAccount() {
  return request({
    url: '/api/app/getAppAccount',
    method: 'get',
  })
}
