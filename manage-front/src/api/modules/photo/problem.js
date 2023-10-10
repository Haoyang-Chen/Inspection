import request from '@/utils/request'

// 查询问题记录列表
export function listProblem(query) {
  return request({
    url: '/photo/composite/problemList',
    method: 'get',
    params: query
  })
}

// 修改问题记录
export function updateProblem(data) {
  return request({
    url: '/photo/composite/updateProblem',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 导出问题记录
export function exportProblem(query) {
  return request({
    url: '/photo/composite/exportProblem',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
