import request from '@/utils/request'

// 获取目标设置列表
export function targetSetList(query) {
  return request({
    url: '/duty/targetSet/list',
    method: 'get',
    params: query
  })
}

// 新增目标设置
export function addTargetSet(data) {
  return request({
    url: '/duty/targetSet/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑目标设置
export function updateTargetSet(data) {
  return request({
    url: '/duty/targetSet/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除目标设置
export function delTargetSet(data) {
  return request({
    url: '/duty/targetSet/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}