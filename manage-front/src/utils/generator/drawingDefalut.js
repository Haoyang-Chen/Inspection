export const drawingDefalut = [{
  layout: 'colFormItem',
  // tagIcon: 'input',
  label: '手机号',
  vModel: 'mobile',
  formId: 6,
  tag: 'el-input',
  placeholder: '请输入手机号',
  // defaultValue: '',
  // span: 24,
  // style: { width: '100%' },
  // clearable: true,
  // prepend: '',
  // append: '',
  // 'prefix-icon': 'el-icon-mobile',
  // 'suffix-icon': '',
  // maxlength: 11,
  // 'show-word-limit': true,
  // readonly: false,
  // disabled: false,
  required: true,
  // changeTag: true,
  // regList: [{
  //   pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
  //   message: '手机号格式错误'
  // }]
}]

/**
 * 格式化后端组件数据
 * @param {Array} data 后端组件数据
 */
export function formatDrawing(data) {
  data.forEach((item, index) => {
    item.layout = 'colFormItem'
    item.formId = 100 + index + 1
    const component = item.component
    if (component === 'string') {
      item.tag = 'el-input'
    } else if (component === 'text') {
      item.tag = 'el-input'
      item.type = 'textarea'
    } else if (component === 'select') {
      item.tag = 'el-select'
    } else if (component === 'file') {
      item.tag = 'el-upload'
      item.tagIcon = 'upload'
      item.buttonText = '点击上传'
      item['list-type'] = 'text'
      item.placeholder = undefined
      item.action = process.env.VUE_APP_BASE_API + "/file/uploadFiles"
    }
  })
  return data
}

/**
 * 格式化前端组件数据
 * @param {Array} data 前端组件数据
 */
export function formatSubmit(data) {
  data.forEach(item => {
    const tag = item.tag
    if (tag === 'el-input') {
      if (item.type && item.type === 'textarea') item.component = 'text'
      else item.component = 'string'
    } else if (tag === 'el-select') {
      item.component = 'select'
    } else if (tag === 'el-upload') {
      item.component = 'file'
    }
  })
  return data
}
