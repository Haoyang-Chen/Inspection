import request from '@/utils/request'

// 查询报警时间列表
export function listWarn(query) {
  return request({
    url: '/cfg/warnins/insList',
    method: 'get',
    params: query
  })
}

// 新增报警时间
export function addWarn(data) {
  return request({
    url: '/cfg/warnins/addIns',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改报警时间
export function updateWarn(data) {
  return request({
    url: '/cfg/warnins/updateIns',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除报警时间
export function delWarn(data) {
  return request({
    url: '/cfg/warnins/deleteIns',
    method: 'post',
    data: JSON.stringify(data)
  })
}
