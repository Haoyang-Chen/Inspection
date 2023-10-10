import request from '@/utils/request'

// 获取列表
export function list(query) {
  return request({
    url: '/change/list',
    method: 'get',
    params: query
  })
}

// 新增
export function add(data) {
  return request({
    url: '/change/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function update(data) {
  return request({
    url: '/change/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function del(data) {
  return request({
    url: '/change/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}