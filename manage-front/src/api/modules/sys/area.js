import request from '@/utils/request'

// 查询作业区域列表
export function listArea(query) {
  return request({
    url: '/sys/cfg/workarea/list',
    method: 'get',
    params: query
  })
}

// 新增作业区域
export function addArea(data) {
  return request({
    url: '/sys/cfg/workarea/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改作业区域
export function updateArea(data) {
  return request({
    url: '/sys/cfg/workarea/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除作业区域
export function delArea(data) {
  return request({
    url: '/sys/cfg/workarea/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}
