import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/sys/user/list',
    method: 'get',
    params: query
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/sys/user/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/sys/user/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/sys/user/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 禁用用户
export function disableUser(data) {
  return request({
    url: '/sys/user/disable',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 启用用户
export function enableUser(data) {
  return request({
    url: '/sys/user/enable',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 用户密码重置
export function resetUserPwd(userIds) {
  return request({
    url: '/sys/user/rePassword',
    method: 'post',
    data: JSON.stringify(userIds)
  })
}

// 根据班组查询人员列表
export function listDeptUser(deptId, type = 2) {
  return request({
    url: '/sys/user/listByDeptTeam',
    method: 'get',
    params: {
      limit: 100000,
      deptId,
      type
    }
  })
}

// 根据部门查询人员列表
export function listDeptUsers(deptId, type = 1) {
  return request({
    url: '/sys/user/listByDeptTeam',
    method: 'get',
    params: {
      limit: 100000,
      deptId,
      type
    }
  })
}

// 查询人员树
export function treeUser(query) {
  return request({
    url: '/sys/dept/treeWithUser',
    method: 'get',
    params: query
  })
}
