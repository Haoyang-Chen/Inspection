import request from '@/utils/request'

// 获取列表
export function listHazardSource(query) {
  return request({
    url: '/risk/hazardSource/list',
    method: 'get',
    params: query
  })
}

// 新增
export function add(data) {
  return request({
    url: '/risk/hazardSource/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function update(data) {
  return request({
    url: '/risk/hazardSource/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function del(data) {
  return request({
    url: '/risk/hazardSource/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 导出
export function hazardSourceExport(query) {
  return request({
    url: '/risk/hazardSource/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 模板下载
export function template() {
  return request({
      url: "/risk/hazardSource/template",
      method: "get",
      responseType: 'blob',
  });
}