import request from '@/utils/request'

// 查询法律法规
export function listLaw(query) {
  return request({
    url: '/webdblaw/list',
    method: 'get',
    params: query
  })
}

// 查询法律法规详情
export function infoLaw(id) {
  return request({
    url: '/webdblaw/info/' + id,
    method: 'get',
  })
}

// 新增法律法规
export function addLaw(data) {
  return request({
    url: '/webdblaw/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改法律法规
export function updateLaw(data) {
  return request({
    url: '/webdblaw/update',
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 删除法律法规
export function delLaw(data) {
  return request({
    url: '/webdblaw/delete',
    method: 'delete',
    data: JSON.stringify(data)
  })
}