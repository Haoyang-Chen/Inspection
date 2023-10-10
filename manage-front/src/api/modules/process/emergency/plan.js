import request from '@/utils/request'

// 获取列表
export function planList(query) {
  return request({
    url: '/emergency/plan/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addPlan(data) {
  return request({
    url: '/emergency/plan/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function updatePlan(data) {
  return request({
    url: '/emergency/plan/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function delPlan(data) {
  return request({
    url: '/emergency/plan/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 获取详情
export function planDetail(id) {
  return request({
    url: '/emergency/plan/detail?id=' + id,
    method: 'get'
  })
}