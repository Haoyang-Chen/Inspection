import request from '@/utils/request'

// 查询系统信息
export function sysInfo() {
  return request({
    url: '/cfg/system/getInfo',
    method: 'get'
  })
}

// 修改系统信息
export function updateSys(data) {
  return request({
    url: '/cfg/system/setInfo',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询GPS信息
export function GPSInfo() {
  return request({
    url: '/cfg/gps/get',
    method: 'get'
  })
}

// 修改GPS信息
export function updateGPS(data) {
  return request({
    url: '/cfg/gps/set',
    method: 'post',
    data
  })
}

// 查询当前登录用户部门树
export function deptTree() {
  return request({
    url: '/sys/dept/deptTreeByUser',
    method: 'get',
  })
}

// 修改用户密码
export function resetPwd(data) {
  return request({
    url: '/sys/user/password',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 查询App二维码
export function appQR() {
  return request({
    url: '/msg/appVersion',
    method: 'get'
  })
}



