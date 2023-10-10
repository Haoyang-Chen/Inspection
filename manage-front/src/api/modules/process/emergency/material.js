import request from '@/utils/request'

// 获取列表
export function materialList(query) {
  return request({
    url: '/emergency/material/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addMaterial(data) {
  return request({
    url: '/emergency/material/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function updateMaterial(data) {
  return request({
    url: '/emergency/material/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function delMaterial(data) {
  return request({
    url: '/emergency/material/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 获取详情
export function materialDetail(id) {
  return request({
    url: '/emergency/material/detail?id=' + id,
    method: 'get'
  })
}