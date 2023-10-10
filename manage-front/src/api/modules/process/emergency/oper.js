import request from '@/utils/request'

// 获取列表/emergency​/drillOper​/list
export function drillOperList(query) {
  return request({
    url: '/emergency/drillOper/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addDrillOper(data) {
  return request({
    url: '/emergency/drillOper/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function updateDrillOper(data) {
  return request({
    url: '/emergency/drillOper/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function delDrillOper(data) {
  return request({
    url: '/emergency/drillOper/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 获取详情
export function drillOperDetail(id) {
  return request({
    url: '/emergency/drillOper/detail?id=' + id,
    method: 'get'
  })
}