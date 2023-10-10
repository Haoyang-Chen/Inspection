import request from '@/utils/request'

// 查询消息提醒列表
export function listMsg(query) {
  return request({
    url: '/msg/list',
    method: 'get',
    params: query
  })
}

// 删除消息提醒
export function delMsg(data) {
  return request({
    url: '/msg/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 标记为已读
export function readMsg(data) {
  return request({
    url: '/msg/read',
    method: 'post',
    data: JSON.stringify(data)
  })
}
