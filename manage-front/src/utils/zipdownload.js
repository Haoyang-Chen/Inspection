import axios from 'axios'
import {
  getToken
} from '@/utils/auth'
import config from "../../vue.config";
import {
  mimeMap
} from "./mime";

const baseUrl = process.env.VUE_APP_BASE_API
export function downLoadZip(str, filename) {
  var url = baseUrl + str
  axios({
    method: 'get',
    url: url,
    responseType: 'blob',
    headers: {
      'Authorization': 'Bearer ' + getToken()
    }
  }).then(res => {
    resolveBlob(res, filename)
  })
}
/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, fileName = "") {
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  var contentDisposition = decodeURI(res.headers['content-disposition'])
  var result = patt.exec(contentDisposition)
  var name = result[1]
  name = name.replace(/\"/g, '')
  var suffix = name.substr(name.lastIndexOf(".") + 1)
  if (fileName.length > 0) {
    fileName = fileName.lastIndexOf(".") >= 0 ? fileName : fileName + "." + suffix;
  } else {
    fileName = name
  }
  var blob = new Blob([res.data], {
    type: mimeMap[suffix]
  })
  const aLink = document.createElement('a')
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}

/**
 * 根据后端数据生成文件地址
 * @param {Object} fileName 文件名
 * @param {String} uri 标识符
 */
export function urlOfFileName(fileName, uri = "/file/down/") {
  return baseUrl + uri + fileName;
}

/**
 * 根据前端数据生成文件名
 * @param {Object} url 文件地址
 * @param {String} uri 标识符
 */
export function fileNameOfUrl(url, uri = "/file/down/") {
  return url.replace(baseUrl + uri, "");
}

/**
 * 判断文件是否为常见图片类型
 * @param {String} filePath 文件路径
 */
export function isImageFile(filePath) {
  if (!filePath || !filePath.length) return false
  const index = filePath.lastIndexOf(".")
  if (!index) return false
  const suffix = filePath.substr(index + 1)
  return ["bmp", "jpg", "png", "tif", "gif", "pcx", "tga", "exif", "fpx", "svg", "psd", "cdr", "pcd", "dxf", "ufo", "eps", "ai", "raw", "wmf", "jpeg"].includes(suffix);
}
