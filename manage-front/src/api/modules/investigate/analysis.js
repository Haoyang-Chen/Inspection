import request from '@/utils/request'

// 查询隐患排查统计分析-主数据
export function chartPanel() {
  return request({
    url: '/trouble/analysis/levelAndStatus',
    method: 'get'
  })
}

// 查询隐患排查统计分析-隐患统计
export function chartAmount() {
  return request({
    url: '/trouble/analysis/levelCountByMonth',
    method: 'get'
  })
}

// 查询隐患排查统计分析-隐患来源占比
export function chartSource() {
  return request({
    url: '/trouble/analysis/sourceCount',
    method: 'get'
  })
}

// 查询隐患排查统计分析-隐患细分类别统计
export function chartCategory() {
  return request({
    url: '/trouble/analysis/subClassCount',
    method: 'get'
  })
}
