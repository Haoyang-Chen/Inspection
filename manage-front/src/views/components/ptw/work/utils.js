import store from '@/store'

/**
 * 不同作业类型的作业等级
 * @param {Number} type 作业类型
 */
export function workLevels(type) {
  if (type === 1)
    return store.state.common.workDHlevels
  else if (type === 3)
    return store.state.common.workGClevels
  else if (type === 4)
    return store.state.common.workDZlevels
  else return []
}

/**
 * 不同作业类型和等级的时间间隔提示信息
 * @param {Number} type 作业类型
 * @param {Number} level 作业等级
 */
export function workIntervalTips(type, level) {
  if (type === 1) {
    if (level === 0) return "轻度热作业3天"
    else if (level === 1) return "一级动火8小时"
    else if (level === 2) return "二级动火3天"
    else if (level === 3) return "特级动火8小时"
    else return undefined
  } else if (type === 2) return "受限空间作业24小时"
  else if (type === 3) return "高处作业24小时"
  else if (type === 4) return "吊装作业24小时"
  else return undefined
}

/**
 * 不同作业类型和等级的时间间隔验证
 * @param {String} start 申请作业开始时间
 * @param {String} end 申请作业结束(延期)时间
 * @param {Number} type 作业类型
 * @param {Number} level 作业等级
 */
export function verifyWorkInterval(start, end, type, level) {
  const startDate = Date.parse(start)
  const endDate = Date.parse(end)
  const diff = Math.abs(startDate - endDate)
  if (type === 1) {
    if (level === 1 || level === 3)
      return diff <= 8 * 3600 * 1000
    else if (level === 0 || level === 2)
      return diff <= 3 * 24 * 3600 * 1000
    else return true
  } else if (type === 2 || type === 3 || type === 4) {
    return diff <= 24 * 3600 * 1000
  } else {
    return true
  }
}
