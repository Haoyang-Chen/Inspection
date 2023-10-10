import request from '@/utils/request'

// 查询部门树
export function treeDept(query) {
  return request({
    url: '/sys/dept/tree',
    method: 'get',
    params: query
  })
}

// 新增部门、组
export function addDept(data) {
  return request({
    url: '/sys/dept/save',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改部门、组
export function updateDept(data) {
  return request({
    url: '/sys/dept/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除部门、组
export function delDept(data) {
  return request({
    url: '/sys/dept/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 根据部门查询班组列表
export function listTeam(deptId) {
  return request({
    url: '/sys/dept/teamByDept',
    method: 'get',
    params: {
      deptId
    }
  })
}
