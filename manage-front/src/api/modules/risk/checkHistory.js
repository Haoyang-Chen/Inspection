import request from '@/utils/request'

// 检查记录列表
export function checkList(query) {
  return request({
    url: '/risk/check/list',
    method: 'get',
    params: query
  })
}

// 导出
export function checkListExport(query) {
  return request({
    url: '/risk/check/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}