import request from '@/utils/request'

// 查询风险辨识列表
export function listRisk(query) {
  return request({
    url: '/risk/list',
    method: 'get',
    params: query
  })
}

// 新增风险辨识
export function addRisk(data) {
  return request({
    url: '/risk/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改风险辨识
export function updateRisk(data) {
  return request({
    url: '/risk/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除风险辨识
export function delRisk(data) {
  return request({
    url: '/risk/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}
