import request from '@/utils/request'

// 查询列表
export function alarmList(query) {
  return request({
    url: '/camera/alarm/list',
    method: 'get',
    params: query
  })
}

// 处理
export function operAlarm(data) {
  return request({
    url: '/camera/alarm/oper',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 当日数量统计
export function alarmstatistics(query) {
  return request({
    url: '/camera/alarm/alarmstatistics',
    method: 'get',
    params: query
  })
}

// 当日报警种类数量
export function alarmtypes(query) {
  return request({
    url: '/camera/alarm/alarmtypes',
    method: 'get',
    params: query
  })
}

// 近10日报警数量
export function recentquantity(query) {
  return request({
    url: '/camera/alarm/recentquantity',
    method: 'get',
    params: query
  })
}