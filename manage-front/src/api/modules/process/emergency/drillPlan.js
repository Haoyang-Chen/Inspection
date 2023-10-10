import request from '@/utils/request'

// 获取列表
export function drillPlanList(query) {
  return request({
    url: '/emergency/drillPlan/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addDrillPlan(data) {
  return request({
    url: '/emergency/drillPlan/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function updateDrillPlan(data) {
  return request({
    url: '/emergency/drillPlan/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function delDrillPlan(data) {
  return request({
    url: '/emergency/drillPlan/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 获取详情
export function drillPlanDetail(id) {
  return request({
    url: '/emergency/drillPlan/detail?id=' + id,
    method: 'get'
  })
}