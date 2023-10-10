import request from '@/utils/request'

// 查询巡检标签列表
export function listLabel(query) {
  return request({
    url: '/ins-label/list',
    method: 'get',
    params: query
  })
}

// 新增巡检标签
export function addLabel(data) {
  return request({
    url: '/ins-label/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改巡检标签
export function updateLabel(data) {
  return request({
    url: '/ins-label/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除巡检标签
export function delLabel(data) {
  return request({
    url: '/ins-label/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 巡检标签模板下载
export function templateLabel() {
  return request({
    url: '/ins-label/mouldExport',
    method: 'get',
    responseType: 'blob'
  })
}
