import request from '@/utils/request'

// 查询轮播图列表
export function listBanner(query) {
  return request({
    url: '/cfg/adv/list',
    method: 'get',
    params: query
  })
}

// 新增轮播图
export function addBanner(data) {
  return request({
    url: '/cfg/adv/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改轮播图
export function updateBanner(data) {
  return request({
    url: '/cfg/adv/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除轮播图
export function delBanner(data) {
  return request({
    url: '/cfg/adv/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}


//首页-企业账号数量-用户数量-当日登入账号
export function mainCount_API(params) {
  return request({
    url: '/super/mainCount',
    method: 'get',
    params
  })
}

//隐患统计-隐患总数-重大隐患总数
export function troubleCountByMonth_API(params) {
  return request({
    url: '/super/troubleCountByMonth',
    method: 'get',
    params
  })
}

//作业票统计
export function ticketCountByMonth_API(params) {
  return request({
    url: '/super/ticketCountByMonth',
    method: 'get',
    params
  })
}


//已推送巡检任务统计
export function insCountByMonth_API(params) {
  return request({
    url: '/super/insCountByMonth',
    method: 'get',
    params
  })
}