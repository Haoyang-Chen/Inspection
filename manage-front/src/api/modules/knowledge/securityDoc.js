import request from '@/utils/request'

// 查询安全文件
export function listSecdoc(query) {
  return request({
    url: '/webdbsecuritydocument/list',
    method: 'get',
    params: query
  })
}

// 查询安全文件详情
export function infoSecdoc(id) {
  return request({
    url: '/webdbsecuritydocument/info/' + id,
    method: 'get',
  })
}

// 新增安全文件
export function addSecdoc(data) {
  return request({
    url: '/webdbsecuritydocument/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改安全文件
export function updateSecdoc(data) {
  return request({
    url: '/webdbsecuritydocument/update',
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 删除安全文件
export function delSecdoc(data) {
  return request({
    url: '/webdbsecuritydocument/delete',
    method: 'delete',
    data: JSON.stringify(data)
  })
}