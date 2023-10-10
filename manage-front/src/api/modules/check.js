import request from '@/utils/request'

// 查询检查表列表
export function listCheck(query) {
  return request({
    url: '/checkform/list',
    method: 'get',
    params: query
  })
}

// 新增检查表
export function addCheck(data) {
  return request({
    url: '/checkform/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改检查表
export function updateCheck(data) {
  return request({
    url: '/checkform/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除检查表
export function delCheck(data) {
  return request({
    url: '/checkform/delCheckForm',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询检查项列表
export function listItem(query) {
  return request({
    url: '/checkform/itemListByForm',
    method: 'get',
    params: query
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
export function templateItem() {
  return request({
    url: '/checkform/mouldExport',
    method: 'get',
    responseType: 'blob'
  })
}
