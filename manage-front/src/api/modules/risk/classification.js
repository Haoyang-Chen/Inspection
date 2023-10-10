import request from '@/utils/request'

// 获取列表
export function listClassification(query) {
  return request({
    url: '/risk/classification/list',
    method: 'get',
    params: query
  })
}

// 新增
export function add(data) {
  return request({
    url: '/risk/classification/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function update(data) {
  return request({
    url: '/risk/classification/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function del(data) {
  return request({
    url: '/risk/classification/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 详情
export function detail(id) {
  return request({
    url: '/risk/classification/detail/' + id,
    method: 'get'
  })
}

// 导出风险告知卡详情
export function exportCard(query) {
  return request({
    url: "/risk/classification/fxgzkExport",
    method: 'get',
    responseType: 'blob',
    params: query
  });
}

// 风险告知卡二维码
export function qrCode(id) {
  return request({
    url: '/risk/classification/qrCode/' + id,
    method: 'get'
  })
}

// 导出风险管控清单
export function classificationExport(query) {
  return request({
    url: '/risk/classification/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}