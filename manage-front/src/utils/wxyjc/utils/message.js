/**
 * @author wangze
 * @date 2018-08-06 9:35.
 * @email 595702583@qq.com
 **/

import {Message, Notification} from 'element-ui'

const message = {
  success (msg) {
    Message({
      message: msg,
      type: 'success'
    })
  },
  error (msg) {
    Message.error(msg)
  },
  warn (msg) {
    Message({
      message: msg,
      type: 'warning'
    })
  },
  message (config) {
    Message(config)
  }
}

const notify = {
  notify (config) {
    Notification(config)
  },
  info (title, msg) {
    Notification({
      title: title,
      message: msg,
      type: 'error'
    })
  },
  success (title, msg) {
    Notification({
      title: title,
      message: msg,
      type: 'success'
    })
  },
  warn (title, msg) {
    Notification({
      title: title,
      message: msg,
      type: 'warning'
    })
  },
  error (title, msg) {
    Notification({
      title: title,
      message: msg,
      type: 'error'
    })
  }
}

export {message as Message, notify}
