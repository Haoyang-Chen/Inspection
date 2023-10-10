import request from '@/utils/request'

// 查询巡检点列表
export function listPoint(query) {
  return request({
    url: '/ins-point/list',
    method: 'get',
    params: query
  })
}

// 查询巡检点
export function getPoint(pointId) {
  return request({
    url: '/ins-point/get/' + pointId,
    method: 'get',
  })
}

// 新增巡检点
export function addPoint(data) {
  return request({
    url: '/ins-point/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改巡检点
export function updatePoint(data) {
  return request({
    url: '/ins-point/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除巡检点
export function delPoint(data) {
  return request({
    url: '/ins-point/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 巡检点模板下载
export function templatePoint() {
  return request({
    url: '/ins-point/mouldExport',
    method: 'get',
    responseType: 'blob'
  })
}
