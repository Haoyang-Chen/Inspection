import request from '@/utils/request'

// 查询作业票统计分析-数量统计
export function chartAmount(type = 'status') {
  let uri
  if (type === 'status') uri = 'countByStatus'
  else if (type === 'month') uri = 'countByMonth'
  else if (type === 'area') uri = 'countByArea'
  else if (type === 'type') uri = 'countByType'
  return request({
    url: '/ticket/analysis/' + uri,
    method: 'get'
  })
}

// 查询作业票统计分析-审核数统计
export function chartApprove(query) {
  return request({
    url: '/ticket/examine/analysisByTypeCount',
    method: 'get',
    params: query
  })
}

// 查询作业票统计分析-各类问题占比
export function chartProblem(query) {
  return request({
    url: '/ticket/examine/analysisByProblem',
    method: 'get',
    params: query
  })
}
