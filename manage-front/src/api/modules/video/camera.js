import request from '@/utils/request'

// 查询列表
export function cameraList(query) {
  return request({
    url: '/camera/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addCamera(data) {
  return request({
    url: '/camera/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改
export function updateCamera(data) {
  return request({
    url: '/camera/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function delCamera(data) {
  return request({
    url: '/camera/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}