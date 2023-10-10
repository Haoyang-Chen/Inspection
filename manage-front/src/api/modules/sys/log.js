import request from '@/utils/request'

// 查询APP登陆记录列表
export function listLog(query) {
  return request({
    url: '/sys/user/applog/logList',
    method: 'get',
    params: query
  })
}

// 导出APP登陆记录
export function exportLog(query) {
  return request({
    url: '/sys/user/applog/logExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
