// 根据行数据获取巡检时间段
export function getPeriod(row) {
  if (row.taskType === 1) {
    return formatTime(row.taskStartDateTime) + "-" + formatTime(row.taskEndDateTime)
  } else {
    if (!row.execStartDate) {
      return ""
    }
    if (!row.finishDate) {
      return formatTime(row.execStartDate)
    }
    return formatTime(row.execStartDate) + "-" + formatTime(row.finishDate)
  }
}
/** 格式化时间 */
function formatTime(time) {
  const date = new Date(time)
  let hh = date.getHours()
  hh = hh < 10 ? "0" + hh : hh
  let mm = date.getMinutes()
  mm = mm < 10 ? "0" + mm : mm
  return hh + ":" + mm
}

/** 获取当前日期 yyyy-MM-dd */
export function getCurrentDate() {
  const yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1
  mm = mm < 10 ? "0" + mm : mm
  let dd = new Date().getDate()
  dd = dd < 10 ? "0" + dd : dd
  return yy + "-" + mm + "-" + dd
}
