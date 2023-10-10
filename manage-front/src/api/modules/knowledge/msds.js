import request from '@/utils/request'

// 查询MSDS
export function listMSDS(query) {
  return request({
    url: '/webdbmsds/list',
    method: 'get',
    params: query
  })
}

// 查询MSDS详情
export function infoMSDS(id) {
  return request({
    url: '/webdbmsds/info/' + id,
    method: 'get',
  })
}

// 新增MSDS
export function addMSDS(data) {
  return request({
    url: '/webdbmsds/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改MSDS
export function updateMSDS(data) {
  return request({
    url: '/webdbmsds/update',
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 删除MSDS
export function delMSDS(data) {
  return request({
    url: '/webdbmsds/delete',
    method: 'delete',
    data: JSON.stringify(data)
  })
}