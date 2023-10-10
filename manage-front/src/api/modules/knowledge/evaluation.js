import request from '@/utils/request'

// 查询符合性评价列表
export function listComment(query) {
  return request({
    url: '/webdbcomment/list',
    method: 'get',
    params: query
  })
}

// 查询符合性评价详情
export function infoComment(id) {
  return request({
    url: '/webdbcomment/info/' + id,
    method: 'get',
  })
}

// 保存符合性评价
export function saveComment(data) {
  return request({
    url: '/webdbcomment/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改符合性评价
export function updateComment(data) {
  return request({
    url: '/webdbcomment/update',
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 删除符合性评价
export function delComment(data) {
  return request({
    url: '/webdbcomment/delete',
    method: 'delete',
    data: JSON.stringify(data)
  })
}