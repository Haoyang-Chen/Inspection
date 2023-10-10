import request from '@/utils/request'

// 查询区域现场问题统计+事件类型占比+区域事件详情
export function chartProblems(startDate, endDate) {
  return request({
    url: '/ins-task/report/xcwt',
    method: 'get',
    params: {
      startDate,
      endDate
    }
  })
}

// 导出区域事件详情
export function exportDetail(query) {
  return request({
    url: '/ins-task/report/qysjxqExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
