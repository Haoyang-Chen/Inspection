import request from '@/utils/request'

// 获取未遂列表
export function abortiveList(query) {
  return request({
    url: '/accident/abortive/list',
    method: 'get',
    params: query
  })
}

// 新增未遂
export function addAbortive(data) {
  return request({
    url: '/accident/abortive/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑未遂
export function updateAbortive(data) {
  return request({
    url: '/accident/abortive/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除未遂
export function delAbortive(data) {
  return request({
    url: '/accident/abortive/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}