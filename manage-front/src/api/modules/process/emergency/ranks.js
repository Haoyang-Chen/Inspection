import request from '@/utils/request'

// 获取列表
export function ranksList(query) {
  return request({
    url: '/emergency/ranks/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addRanks(data) {
  return request({
    url: '/emergency/ranks/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function updateRanks(data) {
  return request({
    url: '/emergency/ranks/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function delRanks(data) {
  return request({
    url: '/emergency/ranks/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 获取详情
export function ranksDetail(id) {
  return request({
    url: '/emergency/ranks/detail?id=' + id,
    method: 'get'
  })
}