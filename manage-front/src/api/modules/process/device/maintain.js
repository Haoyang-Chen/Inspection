import request from '@/utils/request'

// 获取维护列表
export function maintainList(query) {
  return request({
    url: '/company/device/maintainList',
    method: 'get',
    params: query
  })
}

// 新增维护记录
export function addMaintain(data) {
  return request({
    url: '/company/device/addMaintain',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑维护记录
export function updateMaintain(data) {
  return request({
    url: '/company/device/updateMaintain',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除维护记录
export function delMaintain(data) {
  return request({
    url: '/company/device/delMaintain',
    method: 'post',
    data: JSON.stringify(data)
  })
}
  