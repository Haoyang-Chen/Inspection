import request from '@/utils/request'

// 查询施工人员列表
export function listWorker(query) {
  return request({
    url: '/worker/list',
    method: 'get',
    params: query
  })
}

// 查询施工人员工作证书列表
export function listCer(workerId) {
  return request({
    url: '/worker/certListByWorkerId?workerId=' + workerId,
    method: 'get'
  })
}

// 新增施工人员
export function addWorker(data) {
  return request({
    url: '/worker/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改施工人员
export function updateWorker(data) {
  return request({
    url: '/worker/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除施工人员
export function delWorker(data) {
  return request({
    url: '/worker/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 禁用施工人员
export function disableWorker(data) {
  return request({
    url: '/sys/user/disable',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 启用施工人员库
export function enableWorker(data) {
  return request({
    url: '/sys/user/enable',
    method: 'post',
    data: JSON.stringify(data)
  })
}
