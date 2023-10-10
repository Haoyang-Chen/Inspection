import request from '@/utils/request'

// 查询作业票列表
export function listWork(query) {
  return request({
    url: '/ticket/list',
    method: 'get',
    params: query
  })
}

// 查询作业票
export function getWork(workId) {
  return request({
    url: '/ticket/detail?id=' + workId,
    method: 'get'
  })
}

// 新增作业票
export function addWork(data) {
  return request({
    url: '/ticket/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改作业票
export function updateWork(data) {
  return request({
    url: '/ticket/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 提交作业票
export function submitWork(data) {
  return request({
    url: '/ticket/applySubmit',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 取消作业票
export function cancelWork(data) {
  return request({
    url: '/ticket/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询已添加的子票类型
export function typesSubwork(parentId) {
  return request({
    url: '/ticket/getChildTicketTypes?id=' + parentId,
    method: 'get'
  })
}

// 评估审批作业票
export function apvWork(data) {
  return request({
    url: '/ticket/approve',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 远程签发作业票
export function rsiWork(data) {
  return request({
    url: '/ticket/remoteSignCommit',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询现场确认信息
export function getSC(workId) {
  return request({
    url: '/ticket/getOnSiteInfo?ticketId=' + workId,
    method: 'get'
  })
}

// 查询现场气体检测信息
export function getSG(workId) {
  return request({
    url: '/ticket/getGasList?ticketId=' + workId,
    method: 'get'
  })
}

// 延期申请作业票
export function rapvWork(data) {
  return request({
    url: '/ticket/delay',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 延期签发作业票
export function dsiWork(data) {
  return request({
    url: '/ticket/delaySign',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询延期申请、延期签发信息
export function getDelay(type, workId) {
  const uri = type === 1 ? 'getDelayInfo' : 'getDelaySignInfo'
  return request({
    url: '/ticket/' + uri + '?ticketId=' + workId,
    method: 'get'
  })
}

// 完工申请作业票
export function eapvWork(data) {
  return request({
    url: '/ticket/finishApply',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 完工审批作业票
export function endWork(data) {
  return request({
    url: '/ticket/finishApprove',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询完工申请、完工审批信息
export function getEnd(type, workId) {
  const uri = type === 1 ? 'getFinishApplyInfo' : 'getFinishApproveInfo'
  return request({
    url: '/ticket/' + uri + '?ticketId=' + workId,
    method: 'get'
  })
}

// 关闭作业票
export function examWork(data) {
  return request({
    url: '/ticket/examine/exam',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询审核问题统计列表
export function listProblem(query) {
  return request({
    url: '/ticket/examine/list',
    method: 'get',
    params: query
  })
}

// 导出所有作业票记录
export function exportWorks(query) {
  return request({
    url: '/ticket/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 导出单个作业票记录
export function exportWork(query) {
  return request({
    url: '/ticket/singleExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 导出审核问题统计记录
export function exportProblem(query) {
  return request({
    url: '/ticket/examine/listExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 单个作业票进程查询
export function fullProcess(workId) {
  return request({
    url: '/ticket/fullProcess?ticketId=' + workId,
    method: 'get'
  })
}