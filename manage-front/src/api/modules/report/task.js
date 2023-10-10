import request from '@/utils/request'

// 查询检点异常统计+线路异常占比+线路异常详情
export function chartTasks(startDate, endDate) {
  return request({
    url: '/ins-task/report/xjrw',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

// 导出线路异常详情
export function exportDetail(query) {
  return request({
    url: '/ins-task/report/lxycxqExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
