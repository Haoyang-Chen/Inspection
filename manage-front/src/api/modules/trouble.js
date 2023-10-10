import request from '@/utils/request'

// 查询隐患基础列表
export function listTrouble(query) {
  return request({
    url: '/trouble/baseList',
    method: 'get',
    params: query
  })
}

// 新增隐患基础
export function addTrouble(data) {
  return request({
    url: '/trouble/addBase',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改隐患基础
export function updateTrouble(data) {
  return request({
    url: '/trouble/updateBase',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除隐患基础
export function delTrouble(data) {
  return request({
    url: '/trouble/delBase',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 隐患基础模板下载
export function templateTrouble() {
  return request({
    url: '/trouble/mouldExport',
    method: 'get',
    responseType: 'blob'
  })
}

// 导出隐患基础记录
export function exportTrouble(query) {
  return request({
    url: '/trouble/baseListExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
