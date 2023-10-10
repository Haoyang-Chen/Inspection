export const pickerOptions = {
  disabledDate(time) {
    const now = Date.now()
    if (time.getTime() < now - 24 * 60 * 60 * 1000 * 10 || time.getTime() > now) {
      return true
    } else if (time.getTime() > now) {
      return true
    } else {
      return false
    }
  }
}

// days 天数
export function pickerValue(days) {
  var day = days ? days : 9;
  const now = Date.now()
  var start = now - 24 * 60 * 60 * 1000 * (day - 1)
  var end = now
  return [formatDate(start, true), formatDate(end, false)]
}

export function formatDate(value, isStart) {
  var date = new Date(value)
  var year = date.getFullYear()
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  if (isStart) {
    return year + '-' + month + '-' + day + ' ' + "00" + ':' + "00" + ':' + "00"
  } else {
    return year + '-' + month + '-' + day + ' ' + "23" + ':' + "59" + ':' + "59"
  }
}

export function verifyInterval(start, end, day) {
  const startDate = Date.parse(start)
  const endDate = Date.parse(end)
  const diff = Math.abs(startDate - endDate)
  return diff < day * 24 * 3600 * 1000
}