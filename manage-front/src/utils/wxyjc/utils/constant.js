/**
 * @author wangze
 * @date 2018-08-02 19:43.
 * @email 595702583@qq.com
 **/

// export {default as Navbar} from './Navbar'

// /**
//  * 判断是否是数字
//  * @param val
//  * @returns {boolean}
//  */
// function isIntNum(val) {
//   const regPos = /^\d+$/ // 非负整数
//   const regNeg = /^\-[1-9][0-9]*$/ // 负整数
//   if (regPos.test(val) || regNeg.test(val)) {
//     return true
//   } else {
//     return false
//   }
// }

// /**
//  * 获取数组
//  * @param enumType
//  * @returns {Array}
//  */
// function getEnumArray(enumType) {
//   const resultArray = []
//   for (let i = 0; i < enumType.length; i++) {
//     if (enumType[i] || enumType[i] === 0) {
//       resultArray.push({
//         value: i,
//         text: enumType[i]
//       })
//     }
//   }
//   return resultArray
// }

/**
 * 工卡状态  1-试用，2-正常,3-过期
 * @type {string[]}
 */
// const CardStatusType = ['', '试用', '正常', '禁用']
let a = null
const CardStatusType = {
  trial: {
    value: 1,
    text: '试用'
  },
  normal: {
    value: 2,
    text: '正常'
  },
  forbidden: {
    value: 3,
    text: '过期'
  }
}

/**
 * 工卡类型 1-一代工卡,2-代工卡
 * @type {string[]}
 */
// const CardType = ['', '一代工卡', '二代工卡']
const CardType = {
  one: {
    value: 1,
    text: '一代工卡'
  },
  two: {
    value: 2,
    text: '二代工卡'
  },
  three: {
    value: 3,
    text: 'NB工卡'
  }
}

const CompanyStatus = {
  forbidden: {
    value: -1,
    text: '禁用',
    name: 'forbidden',
    tag: 'danger'
  },
  dredge: {
    value: 0,
    text: '开通',
    name: 'dredge',
    tag: 'info'
  },
  normal: {
    value: 1,
    text: '正常',
    name: 'normal',
    tag: 'success'
  }
}
/**
 * 性别
 * @type
 */
const SexEnum = {
  man: {
    value: 1,
    text: '男'
  },
  women: {
    value: 0,
    text: '女'
  },
  women2: {
    value: 2,
    text: '女'
  }
}

const DeviceTypeEnum = {
  card: {
    value: 3,
    text: '工卡'
  },
  label: {
    value: 5,
    text: '标签'
  }
}
/**
 * 管理范围
 * @type
 */
const DataRange = {
  all: {
    value: 'all',
    text: '全公司'
  },
  self: {
    value: 'self',
    text: '所在部门及下级部门'
  },
  special: {
    value: 'special',
    text: '特定部门'
  }
}

const LocationTypeEnum = {
  all: {
    value: 3,
    text: 'gps+北斗'
  },
  gps: {
    value: 1,
    text: 'gps'
  },
  bj: {
    value: 2,
    text: '北斗'
  }
}

const ShapeTypeEnum = {
  rectangle: {
    value: 1,
    text: '矩形'
  },
  polygon: {
    value: 2,
    text: '多边形'
  },
  circle: {
    value: 3,
    text: '圆形'
  }
}

// 时限
const TimeTypeEnum = {
  long: {
    text: '长期',
    value: 1
  },
  short: {
    text: '短期',
    value: 2
  }
}
// 进出权限
const BanInOutEnum = {
  out: {
    text: '限制外出',
    value: 1
  },
  in: {
    text: '禁止进入',
    value: 2
  }
}

const FenceTypeEnum = {
  fence: {
    value: 1,
    text: '电子围栏'
  },
  danger: {
    value: 2,
    text: '危险区域'
  }
}

const OrderTypeEnum = {
  one: {
    value: '1',
    text: '情况紧急，请马上撤离'
  },
  two: {
    value: '2',
    text: '您已进入危险区域，请注意安全'
  },
  three: {
    value: '3',
    text: '您已离开工作区域'
  },
  four: {
    value: '4',
    text: '考勤成功'
  },
  five: {
    value: '5',
    text: '考勤失败'
  },
  six: {
    value: '6',
    text: '巡检成功（马达震动）'
  },
  seven: {
    value: '7',
    text: '巡检成功（语音）'
  },
  eight: {
    value: '8',
    text: '进入巡检模式'
  },
  nine: {
    value: '9',
    text: '巡检时间已到'
  },
  ten: {
    value: 'a',
    text: '上班时间已到'
  },
  eleven: {
    value: 'b',
    text: '开会时间已到'
  },
  twelve: {
    value: 'c',
    text: '您已偏离路线'
  },
  thirteen: {
    value: 'd',
    text: '您已偏离活动区域'
  },
  fourteen: {
    value: 'e',
    text: '您的工卡已到期，请续费后使用'
  }
}
const AlarmTimeEnum = {
  fence: {
    value: 1,
    text: '电子围栏'
  },
  danger: {
    value: 2,
    text: '危险区域'
  },
  low: {
    value: 3,
    text: '工卡低电压'
  },
  sos: {
    value: 4,
    text: 'SOS报警'
  },
  label: {
    value: 5,
    text: '标签低电压'
  },
  charge: {
    value: 6,
    text: '插入座充警报'
  },
  offCharge: {
    value: 7,
    text: '拔开座充警报'
  }
}
const OpenLayerShapeTypeEnum = {
  point: {
    value: 'Point',
    text: '点'
  },
  line: {
    value: 'LineString',
    text: '线'
  },
  polygon: {
    value: 'Polygon',
    text: '多边形'
  },
  circle: {
    value: 'Circle',
    text: '圆'
  },
  box: {
    value: 'Box',
    text: '矩形'
  }
}
/**
 * 室内外
 * @type {{out: {value: number, text: string}, in: {value: number, text: string}}}
 */
const OutInTypeEnum = {
  out: {
    value: 1,
    text: '室外'
  },
  in: {
    value: 2,
    text: '室内'
  }
}

/**
 * 获取风险等级颜色
 * @param fxLevel
 * @returns {*}
 */
export const LEFT_COLOR = ['#FFCC00', '#6699FF', '#FF9999', '#6699CC', '#33CC99', '#009966', '#FFCC99', '#6666CC', '#CC6633']
export const RIGHT_COLOR = ['#339966', '#FF6699', '#FF6633', '#999900', '#669999', '#0099FF', '#66CCCC', '#333399', '#66FF99']

/**
 * SexEnum
 * @param index
 * @param enumType
 * @returns {*}
 */

export function getEnumByIndex(index, enumType) {
  index = parseInt(index, 10)
  if (!(index || index === 0)) {
    return null
  }
  const array = getArrayByEnum(enumType)
  const filterArray = array.filter((x) => {
    return x.value === index
  })
  if (filterArray && filterArray.length === 1) {
    return filterArray[0]
  } else {
    return null
  }
}

export function getEnumNameByIndex(index, enumType) {
  const obj = getEnumByIndex(index, enumType)
  if (obj === null) {
    return ''
  }
  return obj.text
}

/**
 * 根据key，获取枚举
 * @param keyName
 * @param enumType
 * @returns {*}
 */
export function getEnumByKey(keyName, enumType) {
  for (const key in enumType) {
    if (enumType.hasOwnProperty(key)) {
      if (keyName === key.toString()) {
        return enumType[key]
      }
    }
  }
}

export function getArrayByEnum(enumType) {
  const array = []
  for (const key in enumType) {
    if (enumType.hasOwnProperty(key)) {
      array.push(enumType[key])
    }
  }
  return array
}

// 加密ol 点
export function encodeOlPoint(pointArray) {
  const resultArry = []
  pointArray.forEach((value) => {
    resultArry.push(value[0].toString() + ',' + value[1].toString())
  })
  return resultArry.join(';')
}

// 解密 ol 点
export function decodeOlPoint(pointStr) {
  if (!pointStr) {
    return []
  }
  const array = pointStr.split(';')
  return array.map(v => {
    return v.split(',').map((z) => {
      return parseFloat(z)
    })
  })
}

export function encodeAllPoint(pointArray) {
  const resultArry = []
  pointArray.forEach((value) => {
    resultArry.push(value.lng.toString() + ',' + value.lat.toString())
  })
  return resultArry.join(';')
}

export function decodeAllPoint(pointStr) {
  if (!pointStr) {
    return []
  }
  const array = pointStr.split(';')
  return array.map(v => {
    const point = v.split(',')
    return {
      lng: point[0],
      lat: point[1]
    }
  })
}

export function downloadCall(url) { // 下载
  if (document.getElementById('downloadCall')) {
    document.getElementById('downloadCall').remove()
  }
  const url2 = window.URL.createObjectURL(new Blob([url]))
  // window.location.href = url2
  a = document.createElement('a')
  a.setAttribute('download', '')
  a.setAttribute('id', 'downloadCall')
  a.setAttribute('href', url2)
  a.click()
}

export {
  CardStatusType,
  CardType,
  CompanyStatus,
  SexEnum,
  DataRange,
  LocationTypeEnum,
  ShapeTypeEnum,
  TimeTypeEnum,
  BanInOutEnum,
  FenceTypeEnum,
  OrderTypeEnum,
  AlarmTimeEnum,
  OpenLayerShapeTypeEnum,
  OutInTypeEnum,
  DeviceTypeEnum
}
