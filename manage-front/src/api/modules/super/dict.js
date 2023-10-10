import request from '@/utils/request'

// 查询数值单位列表
export function listUnit(query) {
  return request({
    url: '/cfg/unit/list',
    method: 'get',
    params: query
  })
}

// 新增数值单位
export function addUnit(data) {
  return request({
    url: '/cfg/unit/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改数值单位
export function updateUnit(data) {
  return request({
    url: '/cfg/unit/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除数值单位
export function delUnit(data) {
  return request({
    url: '/cfg/unit/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}
