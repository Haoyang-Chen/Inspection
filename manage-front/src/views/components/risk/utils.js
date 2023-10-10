/**
 * 截取当前数据到小数点后两位
 */
export function numFilter(value) {
  const r = /^\+?[1-9][0-9]*$/; // 正整数
  let realVal = value;
  if (!r.test(value)) {
    realVal = parseFloat(value).toFixed(2);
  }
  return realVal
}
 
/**
 * 根据得分判断风险等级
 * @param {*} score 得分
 * @param {*} levelList 安全风险等级判定准则
 * @returns {Number}
 */
export function calcRiskLevel(score, levelList){
  if (score > 0 && (score <= Number(levelList[3].third))) {
    return 1
  } else if (score <= Number(levelList[2].third)) {
    return 2
  } else if (score <= Number(levelList[1].third)) {
    return 3
  } else if (score >= Number(levelList[0].second)) {
    return 4
  } else {
    return
  }
}

/** 安全风险等级判定准则验证 */
export function validateLevel(rule, value, callback) {
  if (value == undefined || value == null || value == "")
    return callback(new Error("安全风险等级判定准则不能为空"))
  if (!value[3].third || !value[2].second || !value[2].third || !value[1].second || !value[1].third || !value[0].second)
    return callback(new Error("安全风险等级判定准则不完整"))
  if (!this.validateScore(value[3].third) || !this.validateScore(value[2].second) || !this.validateScore(value[2].third) || !this.validateScore(value[1].second) || !this.validateScore(value[1].third) || !this.validateScore(value[0].second))
    return callback(new Error("风险值要大于0"))
  callback()
}

export function validateScore(score) {
  return score > 0
}

/**
 * 不同风险等级对应的等级名称
 */
export function levelName(val) {
  switch (val) {
    case 1:
      return '低风险'
    case 2:
      return '一般风险'
    case 3:
      return '较大风险'
    case 4:
      return '重大风险'
  }
}

/**
 * 管控层级名称
 */
export function controlLevelName(val) {
  switch (val) {
    case 1:
      return '岗位'
    case 2:
      return '班组'
    case 3:
      return '车间'
    case 4:
      return '公司'
  }
}