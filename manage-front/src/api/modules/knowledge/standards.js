import request from '@/utils/request'

// 查询标准规范
export function listStandard(query) {
  return request({
    url: '/webdbstandard/list',
    method: 'get',
    params: query
  })
}

// 查询标准规范详情
export function infoStandard(id) {
  return request({
    url: '/webdbstandard/info/' + id,
    method: 'get',
  })
}

// 新增标准规范
export function addStandard(data) {
  return request({
    url: '/webdbstandard/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改标准规范
export function updateStandard(data) {
  return request({
    url: '/webdbstandard/update',
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 删除标准规范
export function delStandard(data) {
  return request({
    url: '/webdbstandard/delete',
    method: 'delete',
    data: JSON.stringify(data)
  })
}