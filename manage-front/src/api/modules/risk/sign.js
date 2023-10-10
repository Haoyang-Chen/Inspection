import request from '@/utils/request'

// 查询警示标志列表
export function updateSign(data) {
  return request({
    url: '/riskpointinfo/updateWarning',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 根据颜色返回指定的警示标志集合
export function listSign(query) {
  return request({
    url: '/risk/classification/warnSignList',
    method: 'get',
    params: query
  })
}
