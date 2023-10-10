import request from '@/utils/request'

// 查询检测预警列表
export function listWarn(query) {
  return request({
    url: '/checkwarn/list',
    method: 'get',
    params: query
  })
}

// 查询检测预警消息数量
export function warnCount(query) {
  return request({
    url: '/checkperson/msstotal',
    method: 'get',
    params: query
  })
}

// 新增检测预警
export function addWarn(data) {
  return request({
    url: '/checkwarn/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改检测预警
export function updateWarn(data) {
  return request({
    url: '/checkwarn/update',
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 删除检测预警
export function delWarn(data) {
  return request({
    url: '/checkwarn/delete',
    method: 'delete',
    data: JSON.stringify(data)
  })
}

// 查询员工资质列表
export function listQualify(query, message = false) {
  const uri = !message ? '/list' : '/msslist'
  return request({
    url: '/checkperson' + uri,
    method: 'get',
    params: query
  })
}

// 查询员工资质
export function getQualify(id) {
  return request({
    url: '/checkperson/info/' + id,
    method: 'get',
  })
}

// 新增员工资质
export function addQualify(data) {
  return request({
    url: '/checkperson/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改员工资质
export function updateQualify(data) {
  return request({
    url: '/checkperson/update',
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 删除员工资质
export function delQualify(data) {
  return request({
    url: '/checkperson/delete',
    method: 'delete',
    data: JSON.stringify(data)
  })
}

// 查询员工资质查询-记录查看列表
export function listDevice(id) {
  return request({
    url: '/checkwarn/travel?checkWarnId=' + id,
    method: 'get'
  })
}

// 查询员工资质查询-记录查看列表
export function listStaff(id) {
  return request({
    url: '/checkperson/travel?personId=' + id,
    method: 'get'
  })
}

// 批量导出
export function exportWarn(params) {
  return request({
      url: "/checkwarn/export",
      method: "get",
      responseType: 'blob',
      params
  });
}