import request from '@/utils/request'

// 获取目标分配列表
export function distributeList(query) {
  return request({
    url: '/duty/targetDistribute/list',
    method: 'get',
    params: query
  })
}

// 新增目标分配
export function addDistribute(data) {
  return request({
    url: '/duty/targetDistribute/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑目标分配
export function updateDistribute(data) {
  return request({
    url: '/duty/targetDistribute/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除目标分配
export function delDistribute(data) {
  return request({
    url: '/duty/targetDistribute/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}