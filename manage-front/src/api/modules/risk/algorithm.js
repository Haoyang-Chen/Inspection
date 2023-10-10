import request from '@/utils/request'

// 获取算法列表
export function algorithm(query) {
  return request({
    url: '/risk/algorithm/get',
    method: 'get',
    params: query
  })
}

// 编辑LS算法
export function editLS(data) {
  return request({
    url: '/risk/algorithm/editLS',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑LEC算法
export function editLEC(data) {
  return request({
    url: '/risk/algorithm/editLEC',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑MES算法
export function editMES(data) {
  return request({
    url: '/risk/algorithm/editMES',
    method: 'post',
    data: JSON.stringify(data)
  })
}