import $ from 'jquery'
import _ from 'underscore'
import cityJson from './../../static/config/provinces_cities­_districts_towns.json'
import request from './request'


/**
 * 工具方法类
 * @type {{}}
 */
const CommonUtil = {}

/**
 * 深度拷贝
 *
 * @param obj
 * @param type 用于以后扩展
 * @returns {any}
 */
CommonUtil.deepClone = (obj, type) => {
  var objClone
  if (!type) {
    var _obj = JSON.stringify(obj)
    objClone = JSON.parse(_obj)
  } else {
    var proto = Object.getPrototypeOf(obj)
    objClone = Object.assign({}, Object.create(proto), obj)
  }

  return objClone
}

/**
 *
 * 合并属性
 *
 * JQuery深度拷贝
 * @param obj
 * @param type
 */
CommonUtil.deepCloneJQuery = (sourceObj, defaultObj) => {
  var obj = $.extend(true, {}, sourceObj)
  return obj
}

/**
 * 判断数组类型
 *
 * @param value
 * @returns {*}
 */
CommonUtil.isArrayFn = (value) => {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value)
  } else {
    return Object.prototype.toString.call(value) === '[object Array]'
  }
}

/**
 * 判断是否存在数组中
 */
CommonUtil.contains = (array, key) => {
  return _.contains(array, key)
}

/**
 * 置空
 * @param obj
 */
CommonUtil.resetObj = (obj) => {
  for (var k in obj) {
    obj[k] = null
  }
}

/**
 * 复制数据(只包含相同属性)
 *
 * @param target
 * @param source
 * @param extparam (扩展参数)
 * @param excute (排除字段)
 */
CommonUtil.copyObjHasParam = (target, source, extparam, excute) => {
  var _source = $.extend({}, source, extparam)

  for (var p in _source) {
    var isc = excute && _.contains(excute, p)
    if (isc) {
      continue
    }

    if (target.hasOwnProperty(p)) {
      target[p] = _source[p]
    }
  }
}

/**
 * 拷贝对象，只拷贝，obj1存在的对象属性,浅拷贝
 * @param obj1
 * @param obj2
 */
export function copyObject(obj1, obj2) {
  if (obj1 === null || obj2 === null) {
    return
  }
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key]
    }
  }
}

/**
 * 清空对象属性的数据
 * @param obj
 */
export function clearObject(obj, defaultValue = null) {
  if (!obj) {
    return
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key])) {
        obj[key] = []
      } else if (isObject(obj[key])) {
        obj[key] = {}
      } else {
        obj[key] = defaultValue
      }
    }
  }
}

// export function cUrlEncode (param, key, encode) {
//   if (param == null) return ''
//   let paramStr = ''
//   let t = typeof (param)
//   if (t === 'string' || t === 'number' || t === 'boolean') {
//     paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
//   } else {
//     for (var i in param) {
//       var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
//       paramStr += cUrlEncode(param[i], k, encode)
//     }
//   }
//   return paramStr
// }

export function isObject(obj) {
  return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
}

export function serializeData(data) {
  // If this is not an object, defer to native stringification.
  if (!isObject(data)) {
    return ((data == null) ? '' : data.toString())
  }
  const buffer = []
  // Serialize each key in the object.
  for (const name in data) {
    if (!data.hasOwnProperty(name)) {
      continue
    }
    const value = data[name]
    if (!(value || value === 0)) {
      continue
    }
    if (Array.isArray(value)) {
      value.forEach((currentValue, index, arr) => {
        buffer.push(encodeURIComponent(name) + '=' + encodeURIComponent((currentValue == null) ? '' : currentValue))
      })
    } else {
      buffer.push(encodeURIComponent(name) + '=' + encodeURIComponent((value == null) ? '' : value))
    }
  }
  // Serialize the buffer and clean it up for transportation.
  const source = buffer.join('&').replace(/%20/g, '+')
  return (source)
}

/**
 * 生成一个用不重复的ID
 */
export function genNonDuplicateID() {
  return Number(Math.random().toString().substr(3, 12) + Date.now()).toString(36)
}

function decNum(a) {
  /* 获取小数位数 */
  var r = 0
  a = a.toString()
  if (a.indexOf('.') !== -1) r = a.split('.')[1].length
  return r
}

function int(a) {
  /* 去除小数点并转成数值 */
  return parseInt(a.toString().replace('.', ''))
}

export function calc(a, b, type) { // 加减乘除
  let r
  const da = decNum(a)
  const db = decNum(b)
  let dsum = da + db
  const dmin = Math.min(da, db)
  let dmax = Math.max(da, db)
  dsum += dmax - dmin
  dsum = Math.pow(10, dsum)
  dmax = Math.pow(10, dmax)
  a = int(a)
  b = int(b)
  if (da > db) {
    b *= Math.pow(10, da - db)
  } else {
    a *= Math.pow(10, db - da)
  }
  switch (type) {
    case 'add':
      r = (a + b) / dmax
      break
    case 'subtract':
      r = (a - b) / dmax
      break
    case 'multiply':
      r = (a * b) / dsum
      break
    case 'divide':
      r = a / b
      break
  }
  return r
}


export function getDistrictsByPPK(pid, fb, params = {}) {
  params.parentId = pid
  request.get('system/region/listByParentId', {
    ...params
  }).then(({
    data
  }) => {
    if (data && data.code === 0) {
      fb && fb(data.data)
    } else {
      this.$message.error(this.$t('tips.getDataFail'))
    }
  })
}

export function getQyjyzt(type) {
  let provinceList = []
  provinceList = request.get(`wxyjc/dictIndex/${type}`).then(res => {
    return res.data.data
  })
  return provinceList
}

export function getProvinceList() {
  let provinceList = []
  for (let index = 0; index < cityJson.length; index++) {
    if (cityJson[index].p === 0) {
      provinceList.push(cityJson[index])
    }
  }
  return provinceList
}

export function getCityList(id) {
  let cityList = []
  for (let index = 0; index < cityJson.length; index++) {
    if (cityJson[index].p === id) {
      cityList.push(cityJson[index])
    }
  }
  return cityList
}

export function getAreaList(id) {
  let areaList = []
  for (let index = 0; index < cityJson.length; index++) {
    if (cityJson[index].p === id) {
      areaList.push(cityJson[index])
    }
  }
  return areaList
}

export function getTownList(id) {
  let townList = []
  for (let index = 0; index < cityJson.length; index++) {
    if (cityJson[index].p === id) {
      townList.push(cityJson[index])
    }
  }
  return townList
}

export default CommonUtil
