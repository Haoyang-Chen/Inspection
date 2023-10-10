/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */
import {
  Message,
  MessageBox
} from 'element-ui'
import {
  resolveBlob
} from "./zipdownload";

const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, startParam, endParam) {
  var search = params
  var rangeStart = undefined
  var rangeEnd = undefined
  if (dateRange && dateRange.length) {
    rangeStart = dateRange[0]
    rangeEnd = dateRange[1]
  }
  if (startParam && startParam.length) search[startParam] = rangeStart
  else search.beginTime = rangeStart;

  if (endParam && endParam.length) search[endParam] = rangeEnd
  else search.endTime = rangeEnd;

  return search
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue == ('' + value)) {
      actions.push(datas[key].dictLabel);
      return false;
    }
  })
  return actions.join('');
}

// 通用下载方法
export function download(fileName) {
  if (fileName.includes(baseURL))
    window.location.href = fileName
  else
    window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments,
    flag = true,
    i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != '' ? treeData : data;
}

/**
 * 为vue-treeselect格式化后端数据
 * @param {*} data 数据源
 */
export function formatTree(data) {
  let arr = data
  arr.forEach((item, index) => {
    if (!item.children) {
      arr[index].children = undefined
    } else {
      formatTree(arr[index].children)
    }
  })
  return arr
}

/**
 * 通用表单更新与新增请求
 * @param {Function} addFunc 新增方法
 * @param {Function} updateFunc 更新方法
 * @param {Object} data 表单提交数据
 * @param {String} uuid 数据唯一标识符
 * @param {String} tips 其它追加提示信息
 */
export function formRequest(addFunc, updateFunc, data, uuid = "id", tips = "") {
  return new Promise(resolve => {
    const id = data[uuid] || undefined
    const msgTitle = id ? "修改" : "添加"
    const msgContent = tips && tips.length ? tips : ""
    const msg = msgTitle + msgContent + "成功"
    if (id) {
      updateFunc(data).then(response => {
        Message.success(msg)
        resolve(response)
      })
    } else {
      addFunc(data).then(response => {
        Message.success(msg)
        resolve(response)
      })
    }
  })
}

/**
 * 通用表格行数据处理请求
 * @param {Function} opFunc 操作方法
 * @param {Array|Number} uuid 数据唯一标识符数组
 * @param {Number} operate 是否是撤销请求
 * @param {String} tips 其它追加提示信息
 */
const rowOperates = [{
    id: 0,
    name: "删除"
  }, {
    id: 1,
    name: "撤销"
  },
  {
    id: 2,
    name: "启用"
  },
  {
    id: 3,
    name: "禁用"
  },
  {
    id: 4,
    name: "重置"
  },
  {
    id: 5,
    name: "提交"
  },
  {
    id: 6,
    name: "取消"
  },
  {
    id: 7,
    name: "关闭"
  },
  {
    id: 8,
    name: "解绑"
  }
]
export function rowsOpRequest(opFunc, uuids, tips = "", operate = 0) {
  return new Promise(resolve => {
    const msgTips = tips && tips.length ? tips : "数据"
    const msgOperate = rowOperates.find(item => item.id === operate).name
    const msg = `是否确认${msgOperate}所选${msgTips}?`
    MessageBox.confirm(msg, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(_ => {
        opFunc(uuids).then(response => {
          Message.success(`${msgOperate}成功`)
          resolve(response)
        })
      })
      .catch(function () {})
  })
}

/**
 * 通用模板文件下载请求
 * @param {Function} downloadFunc 下载方法
 * @param {String} fileName 文件名
 */
export function templateRequest(downloadFunc, fileName = "") {
  downloadFunc(fileName).then(response => {
    resolveBlob(response, fileName)
  })
}

/**
 * 通用导出文件请求
 * @param {Function} exportFunc 导出方法
 * @param {Object} params 导出查询参数
 * @param {String} fileName 文件名
 * @param {String} tips 其它追加提示信息
 */
export function exportRequest(exportFunc, params = {}, fileName = "", tips = "") {
  const msgTips = tips && tips.length ? tips : ""
  const msg = `是否确认导出所有${msgTips}记录信息?`
  MessageBox.confirm(msg, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(_ => {
      const queryParams = params ? {
        ...params,
        page: 1,
        limit: 1000000
      } : {
        page: 1,
        limit: 1000000
      }
      fileName = fileName + getCurrentDate()
      exportFunc(queryParams).then(response => {
        resolveBlob(response, fileName)
      })
    })
    .catch(function () {})
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
