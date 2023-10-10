import request from '@/utils/request'

// 查询异常列表
export function listErrorGroup(query) {
  return request({
    url: '/ins-task-step-point/errorGroupList',
    method: 'get',
    params: query
  })
}

// 异常数列表
export function listError(query) {
  return request({
    url: '/ins-task-step-point/errorList',
    method: 'get',
    params: query
  })
}

// 处理异常
export function handleError(errorId, content) {
  return request({
    url: '/ins-task-step-point/error-process',
    method: 'post',
    data: JSON.stringify({
      pointSubitemId: errorId,
      processResult: content
    })
  })
}

// 异常查询导出
export function errorExport(query) {
  return request({
    url: '/ins-task-step-point/errorExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
