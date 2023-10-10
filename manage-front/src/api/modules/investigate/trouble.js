import request from '@/utils/request'

// 查询当前隐患版本 1 正常流程 2 简易流程
export function getSetting() {
  return request({
    url: '/trouble/getSetting',
    method: 'get',
  })
}

// 查询隐患列表
export function listTrouble(query, isTask = false) {
  return request({
    url: !isTask ? '/trouble/taskRegisterList' : '/trouble/taskList',
    method: 'get',
    params: query
  })
}

// 查询隐患
export function getTrouble(troubleId) {
  return request({
    url: '/trouble/taskRegisterDetail?registerId=' + troubleId,
    method: 'get',
  })
}

// 新增隐患
export function addTrouble(data) {
  return request({
    url: '/trouble/addTaskRegister',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改隐患
export function updateTrouble(data) {
  return request({
    url: '/trouble/updateTaskRegister',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 审核隐患
export function approveTrouble(data) {
  return request({
    url: '/trouble/examTaskRegister',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除隐患
export function delTrouble(data) {
  return request({
    url: '/trouble/delTaskRegister',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 导出隐患列表记录
export function exportTrouble(query) {
  return request({
    url: '/trouble/taskRegisterListExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 发布任务
export function publishTrouble(data) {
  return request({
    url: '/trouble/pubTask',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询发布任务
export function getPublish(taskId) {
  return request({
    url: '/trouble/taskPubDetail?taskId=' + taskId,
    method: 'get',
  })
}

// 重大隐患跟进
export function trackTrouble(data) {
  return request({
    url: '/trouble/trackFollow',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询重大隐患跟进记录
export function listTrack(taskId) {
  return request({
    url: '/trouble/trackFollowLog?taskId=' + taskId,
    method: 'get',
  })
}

// 隐患整改
export function reformTrouble(data) {
  return request({
    url: '/trouble/reform',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询隐患整改记录
export function listReform(taskId) {
  return request({
    url: '/trouble/reformLog?taskId=' + taskId,
    method: 'get',
  })
}

// 隐患整改复查
export function reviewTrouble(data) {
  return request({
    url: '/trouble/review',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 隐患综合查询
export function listQuery(query) {
  return request({
    url: '/trouble/complexList',
    method: 'get',
    params: query
  })
}

// 导出隐患台账记录
export function exportAccount(query) {
  return request({
    url: '/trouble/troubleExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
