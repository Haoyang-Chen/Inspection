import request from '@/utils/request'

// 查询检查列表
export function listCheck(query) {
  return request({
    url: '/checkform/taskList',
    method: 'get',
    params: query
  })
}

// 查询检查详情
export function getCheck(safeId) {
  return request({
    url: '/ins-line/get/' + safeId,
    method: 'get',
  })
}

// 新增检查计划
export function addCheck(data) {
  return request({
    url: '/checkform/addCheckTask',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改检查计划
export function updateCheck(data) {
  return request({
    url: '/checkform/updateCheckTask',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 撤销检查计划
export function revokeCheck(data) {
  return request({
    url: '/checkform/delCheckTask',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 提交检查
export function submitCheck(data, temporary) {
  return request({
    url: temporary ? '/checkform/tempCheck' : '/checkform/check',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 导出检查记录
export function exportCheck(query) {
  return request({
    url: '/checkform/taskListExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 查询检查表类型
export function listCheckType(query) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params: query
  })
}

// 查询检查项列表
export function listItem(checkId) {
  return request({
    url: '/checkform/taskItemByFormId?formId=' + checkId,
    method: 'get'
  })
}

// 新增检查项
export function addItem(data) {
  return request({
    url: '/checkform/addItem',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改检查项
export function updateItem(data) {
  return request({
    url: '/checkform/updateItem',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除检查项
export function delItem(data) {
  return request({
    url: '/checkform/delCheckItem',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 检查项模板下载
export function templateItem(query) {
  return request({
    url: '/ins-label/mouldExport',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
