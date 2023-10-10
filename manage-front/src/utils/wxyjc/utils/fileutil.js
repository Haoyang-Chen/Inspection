import http from './httpRequest'

let FileUtil = {}

/**
 * 创建目录文件对象
 * @param fileUrls
 * @param name
 * @returns {{selected: boolean, name: *|string, files: *|string}}
 */
FileUtil.createDirObj = (fileUrls, name) => {
  return {
    selected: false,
    name: name || '文件包',
    files: fileUrls || ''
  }
}

/**
 * 创建文件对象
 * @param fileUrl
 * @returns {{icon: string|*, name: *, fileType: *, fileShowPath: *, fileDownPath: *, selected: boolean}}
 */
FileUtil.createFileObj = (item, fileOrignalName,fileSize) => {
  let icon
  let fileName
  let fileType
  let fileUrl
  let fileShowPath
  let fileDownPath

  if (!item) {
    throw new Error('文件路径不能为空！')
  }

  fileUrl = item
  fileShowPath = http.adornUrl(`core/show/${fileUrl}`)
  fileDownPath = http.adornUrl(`core/down/${fileUrl}`)

  // 获取文件类型和文件名
  let fileArray = fileUrl.split('.')
  fileName = fileArray[0]
  fileType = fileArray[1]

  let _fileOrignalName = fileOrignalName.split('.')[0]

  // 获取预览图标
  icon = getIcon(fileType)

  var fileObj = {
    icon: icon,
    name: item,
    fileName: _fileOrignalName,
    fileType: fileType,
    fileShowPath: fileShowPath,
    fileDownPath: fileDownPath,
    fileOrignalName: fileOrignalName,
    selected: false,
    fileSize: fileSize
  }

  return fileObj
}

/**
 * 根据 url 转 文件数组
 *
 * @param fileUrl  '1.png,2.png,3.png
 * @returns {Array}
 */
FileUtil.getFileByUrl = (fileUrl) => {
  let fileNames = []
  let files = []
  if (fileUrl) {
    fileNames = fileUrl.split(',')
  } else {
    fileNames = []
  }

  fileNames.forEach((item, index) => {
    var file = FileUtil.createFileObj(item)
    files.push(file)
  })

  return files
}

/**
 * 仅路径
 * @param fileUrl
 * @returns {Array}
 */
FileUtil.getFiles = (fileUrl) => {
  var fileNames = []
  var files = []
  if (fileUrl) {
    fileNames = fileUrl.split(',')
  } else {
    fileNames = []
  }

  for (var i = 0; i < fileNames.length; i++) {
    files.push(fileNames[i])
  }

  return files
}

/**
 * 根据文件数组转路径
 *
 * @param files
 * @returns {string}
 */
FileUtil.tofileUrl = (files) => {
  var filesNames = []
  if (files && files.length) {
    for (var i = 0; i < files.length; i++) {
      filesNames.push(files[i].name + '.' + files[i].fileType)
    }
  }

  return filesNames.join(',')
}

/**
 * 根据文件数组转路径
 *
 * @param files
 * @returns {string}
 */
FileUtil.file2Url = (files) => {
  var filesNames = files.map(file => {
    return file.fileOrignalName + '.' + file.fileType
  })

  return filesNames.join(',')
}

/**
 * 验证文件类型
 * @param fileType
 */
FileUtil.validFile = (fileType, regx) => {
  return /^(jpg|png|xls|xlsx)$/g.test(fileType)
}

/**
 * 获取图标
 * @param fileType
 * @returns {string}
 */
let getIcon = (fileType) => {
  if (!fileType) {
    return 'file'
  }

  switch (fileType) {
    case 'jpg':
      return 'img'
    case 'doc':
      return 'doc'
    case 'xls':
      return 'excel'
    case 'xlsx':
      return 'excel'
    case 'docx':
      return 'doc'
    case 'txt':
      return 'txt'
    case 'png':
      return 'img'
    case 'pdf':
      return 'pdf'
    case 'zip':
      return 'zip'
    default:
      return 'file'
  }
}

export default FileUtil
