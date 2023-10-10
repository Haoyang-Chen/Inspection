import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params: query
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/sys/role/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除角色
export function delRole(data) {
  return request({
    url: '/sys/role/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}

/** 查询菜单树源数据
 * type: 1-web 2-app
 */
export function treeSource(type) {
  return request({
    url: '/sys/menu/listByCompany',
    method: 'get',
    params: {
      menuType: type
    }
  })
}

// 查询有权限菜单 包含web和app
export function treePermission(roleId) {
  return request({
    url: '/sys/menu/menuIdsByRole',
    method: 'get',
    params: {
      roleId
    }
  })
}

// 保存角色的菜单权限 包含web和app
export function savePermission(roleId, menuIds) {
  return request({
    url: '/sys/role/saveMenuList',
    method: 'post',
    data: JSON.stringify({
      roleId,
      menuIdList: menuIds
    })
  })
}
