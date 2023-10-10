import request from '@/utils/request'

// 查询人员考勤统计
export function chartStaff(startDate, endDate) {
  return request({
    url: '/ins-task/report/rykqtj',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

// 查询班组漏检占比
export function chartTeam(startDate, endDate) {
  return request({
    url: '/ins-task/report/bzljzb',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

// 查询巡检考勤详情
export function chartStaffDetail(startDate, endDate) {
  return request({
    url: '/ins-task/report/rykqxq',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

// 导出巡检考勤详情
export function exportDetail(query) {
  return request({
    url: '/ins-task/report/rykqxqExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
