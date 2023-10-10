import request from '@/utils/request'

// 获取详情
export function rateDetail(query) {
  return request({
    url: '/risk/rate/detail',
    method: 'get',
    params: query
  })
}

// 设置频率
export function rateEdit(data) {
  return request({
    url: '/risk/rate/edit',
    method: 'post',
    data: JSON.stringify(data)
  })
}