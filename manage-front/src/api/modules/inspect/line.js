import request from '@/utils/request'

// 查询巡检线路列表
export function listLine(query) {
  return request({
    url: '/ins-line/list',
    method: 'get',
    params: query
  })
}

// 查询巡检线路
export function getLine(lineId) {
  return request({
    url: '/ins-line/get/' + lineId,
    method: 'get',
  })
}

// 新增巡检线路
export function addLine(data) {
  return request({
    url: '/ins-line/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改巡检线路
export function updateLine(data) {
  return request({
    url: '/ins-line/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除巡检线路
export function delLine(data) {
  return request({
    url: '/ins-line/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}
