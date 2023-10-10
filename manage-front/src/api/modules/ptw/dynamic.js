import request from '@/utils/request'

// 查询作业申请配置列表
export function listDynamic(workType) {
  return request({
    url: '/ticket/diy/getByTicketType?ticketType=' + workType,
    method: 'get'
  })
}

// 保存流程设置
export function saveDynamic(data) {
  return request({
    url: '/ticket/diy/saveByTicketType',
    method: 'post',
    data: JSON.stringify(data)
  })
}
