import request from '@/utils/request'

// 获取列表
export function listArea(query) {
  return request({
    url: '/risk/area/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addArea(data) {
  return request({
    url: '/risk/area/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function updateArea(data) {
  return request({
    url: '/risk/area/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function delArea(data) {
  return request({
    url: '/risk/area/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}
  