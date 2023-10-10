import request from '@/utils/request'

// 获取岗位责任书列表
export function respList(query) {
  return request({
    url: '/duty/resp/list',
    method: 'get',
    params: query
  })
}

// 新增岗位责任书
export function addResp(data) {
  return request({
    url: '/duty/resp/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑岗位责任书
export function updateResp(data) {
  return request({
    url: '/duty/resp/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除岗位责任书
export function delResp(data) {
  return request({
    url: '/duty/resp/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}