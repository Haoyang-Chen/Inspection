import request from '@/utils/request'

// 获取注油列表
export function oilList(query) {
  return request({
    url: '/company/device/oilList',
    method: 'get',
    params: query
  })
}

// 新增注油记录
export function addOil(data) {
  return request({
    url: '/company/device/addOil',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑注油记录
export function updateOil(data) {
  return request({
    url: '/company/device/updateOil',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除注油记录
export function delOil(data) {
  return request({
    url: '/company/device/delOil',
    method: 'post',
    data: JSON.stringify(data)
  })
}