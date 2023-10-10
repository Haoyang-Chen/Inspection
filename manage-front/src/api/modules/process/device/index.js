import request from '@/utils/request'

// 获取列表
export function deviceList(query) {
  return request({
    url: '/company/device/list',
    method: 'get',
    params: query
  })
}

// 新增
export function addDevice(data) {
  return request({
    url: '/company/device/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑
export function updateDevice(data) {
  return request({
    url: '/company/device/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除
export function delDevice(data) {
  return request({
    url: '/company/device/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 二维码
export function qrCode(id) {
  return request({
    url: '/qrCode/' + id,
    method: 'get'
  })
}

// 模板下载
export function template() {
  return request({
      url: "/company/device/template",
      method: "get",
      responseType: 'blob',
  });
}
  