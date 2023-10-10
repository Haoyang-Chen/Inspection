import request from '@/utils/request'

// 查询流程设置
export function getProcess(ticketType, level) {
  return request({
    url: '/ticketBaseProcess/detailByTicket',
    method: 'get',
    params: {
      ticketType,
      level
    }
  })
}

// 保存流程设置
export function saveProcess(data) {
  return request({
    url: '/ticketBaseProcess/saveByTicket',
    method: 'post',
    data: JSON.stringify(data)
  })
}
