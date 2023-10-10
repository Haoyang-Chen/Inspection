import request from '@/utils/request'

// 查询现场固定检查项列表
export function listFixed(query) {
  return request({
    url: '/ticket/fixedItem/list',
    method: 'get',
    params: query
  })
}

// 新增现场固定检查项
export function addFixed(data) {
  return request({
    url: '/ticket/fixedItem/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改现场固定检查项
export function updateFixed(data) {
  return request({
    url: '/ticket/fixedItem/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除现场固定检查项
export function delFixed(data) {
  return request({
    url: '/ticket/fixedItem/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}
