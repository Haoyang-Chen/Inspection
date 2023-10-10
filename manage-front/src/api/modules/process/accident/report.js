import request from '@/utils/request'

// 获取事故报告列表
export function reportList(query) {
  return request({
    url: '/accident/report/list',
    method: 'get',
    params: query
  })
}

// 新增事故报告
export function addReport(data) {
  return request({
    url: '/accident/report/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑事故报告
export function updateReport(data) {
  return request({
    url: '/accident/report/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除事故报告
export function delReport(data) {
  return request({
    url: '/accident/report/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 获取事故报告详情
export function reportDetail(id) {
  return request({
    url: '/accident/report/detail?id=' + id,
    method: 'get'
  })
}
