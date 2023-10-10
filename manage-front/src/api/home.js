import request from '@/utils/request'

// 当然巡检点数量
export function drxjds_API(params) {
  return request({
    url: '/home/report/drxjds',
    method: 'get',
    params
  })
}

//当日异常检点数
export function drycjds_API(params) {
  return request({
    url: '/home/report/drycjds',
    method: 'get',
    params
  })
}

//当日未完成检点数量
export function drywcjds_API(params) {
  return request({
    url: '/home/report/drywcjds',
    method: 'get',
    params
  })
}

//当日现场问题数
export function drxcwts_API(params) {
  return request({
    url: '/home/report/drxcwts',
    method: 'get',
    params
  })
}

//当日隐患
export function dryh_API(params) {
  return request({
    url: '/home/report/dryh',
    method: 'get',
    params
  })
}

//当日作业票数量
export function ticketCountByType_API(params) {
  return request({
    url: '/home/report/ticketCountByType',
    method: 'get',
    params
  })
}

// 查询首页漏检统计
export function ljdtj(query) {
  return request({
    url: '/home/report/ljdtj',
    method: 'get',
    params: query
  })
}

// 查询首页异常巡检统计
export function chartAbnomal(query) {
  return request({
    url: '/home/report/ycxjdtj',
    method: 'get',
    params: query
  })
}

// 查询首页事件类型占比
export function chartProblems(query) {
  return request({
    url: '/home/report/problemReport',
    method: 'get',
    params: query
  })
}

// 查询隐患统计
export function troubleReport(query) {
  return request({
    url: '/home/report/troubleReport',
    method: 'get',
    params: query
  })
}

// // 查询首页漏检统计
// export function chartMissed() {
//   return request({
//     url: '/home/report/pointCountByMonth',
//     method: 'get'
//   })
// }

// // 查询首页异常巡检统计
// export function chartAbnomal() {
//   return request({
//     url: '/home/report/errorReportByMonth',
//     method: 'get'
//   })
// }


//首页-风险辨识统计占比
export function riskLevelCount_API(params) {
  return request({
      url: "/home/report/riskLevelCount",
      method: "get",
      params
  });
}