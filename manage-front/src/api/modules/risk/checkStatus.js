import request from '@/utils/request'

// 风险任务列表
export function checkStatusList(query) {
  return request({
    url: '/risk/classification/checkStatusList',
    method: 'get',
    params: query
  })
}
