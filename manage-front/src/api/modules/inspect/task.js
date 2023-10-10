import request from '@/utils/request'

// 查询任务列表
export function listTask(query) {
  return request({
    url: '/ins-task/list',
    method: 'get',
    params: query
  })
}

// 查询任务
export function getTask(taskId) {
  return request({
    url: '/ins-task/get/' + taskId,
    method: 'get',
  })
}

// 新增任务
export function addTask(data) {
  return request({
    url: '/ins-task/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 修改任务
export function updateTask(data) {
  return request({
    url: '/ins-task/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除任务
export function delTask(data) {
  return request({
    url: '/ins-task/delete',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 撤销任务
export function revokeTask(data) {
  return request({
    url: '/ins-task/cancel',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 根据日期获取当日日常巡检任务
export function getDayTask(taskId, date) {
  return request({
    url: '/ins-task/detailByTaskDate',
    method: 'get',
    params: {
      insTaskId: taskId,
      date
    }
  })
}

// 修改当日日常巡检任务
export function updateDayTask(data) {
  return request({
    url: '/ins-task/scheduling/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 根据日期获取当日排班情况
export function getDaySchedule(date) {
  return request({
    url: '/ins-task/detailByDate',
    method: 'get',
    params: {
      date
    }
  })
}

// 查询任务进度列表
export function listProgress(query) {
  return request({
    url: '/ins-task-step/progress',
    method: 'get',
    params: query
  })
}

// 查询任务查询列表
export function listQuery(query) {
  return request({
    url: '/ins-task-step/list',
    method: 'get',
    params: query
  })
}

// 导出任务查询记录
export function exportQuery(query) {
  return request({
    url: '/ins-task-step/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 查询任务查询详情列表
export function listQueryDetail(query) {
  return request({
    url: '/ins-task-step-point/detailByStepId',
    method: 'get',
    params: query
  })
}

// 导出任务查询详情
export function exportQueryDetail(query) {
  return request({
    url: '/ins-task-step-point/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 查询巡检考勤列表
export function listAttendance(query) {
  return request({
    url: '/ins-task-step/attendance',
    method: 'get',
    params: query
  })
}

// 导出巡检考勤
export function exportExcel(query) {
  return request({
    url: '/ins-task-step/exportExcel',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}

// 基础巡检班组行数据
export const baseGroupLine = {
  teamId: undefined,
  teamName: undefined,
  users: [],
  userOptions: [],
  sort: undefined
}

// 基础巡检班次行数据
export const baseRateLine = {
  className: undefined,
  startTime: "",
  endTime: ""
}

// 默认巡检班次行数据
export const defaultRate = [
  {
    className: "早班",
    startTime: "00:00:00",
    endTime: "08:00:00"
  },
  {
    className: "中班",
    startTime: "08:00:00",
    endTime: "16:00:00"
  },
  {
    className: "晚班",
    startTime: "16:00:00",
    endTime: "24:00:00"
  }
]

// 检点查询
export function pointList(query) {
  return request({
    url: '/ins-task-step/pointList',
    method: 'get',
    params: query
  })
}

// 检点查询-导出
export function pointExport(query) {
  return request({
    url: '/ins-task-step/pointList/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}
