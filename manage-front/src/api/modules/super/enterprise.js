import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/company/companyList',
    method: 'get',
    params: query
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/company/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/company/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/company/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 禁用用户
export function disableUser(data) {
  return request({
    url: '/company/disable',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 启用用户
export function enableUser(data) {
  return request({
    url: '/company/enable',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 用户密码重置
export function resetUserPwd(userIds) {
  return request({
    url: '/company/rePassword',
    method: 'post',
    data: JSON.stringify(userIds)
  })
}

/** 查询菜单树源数据
 * type: 1-web 2-app
 */
export function treeSource(type) {
  return request({
    url: '/sys/menu/listByAdmin',
    method: 'get',
    params: {
      menuType: type
    }
  })
}

// 查询有权限菜单 包含web和app
export function treePermission(userId) {
  return request({
    url: '/sys/menu/menuIdsByCompany',
    method: 'get',
    params: {
      deptId: userId
    }
  })
}

// 保存角色的菜单权限 包含web和app
export function savePermission(userId, menuIds) {
  return request({
    url: '/company/saveMenuList',
    method: 'post',
    data: JSON.stringify({
      deptId: userId,
      menuIdList: menuIds
    })
  })
}
