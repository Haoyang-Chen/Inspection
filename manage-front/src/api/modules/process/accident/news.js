import request from '@/utils/request'

// 获取事故快报列表
export function newsList(query) {
  return request({
    url: '/accident/news/list',
    method: 'get',
    params: query
  })
}

// 新增事故快报
export function addNews(data) {
  return request({
    url: '/accident/news/add',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑事故快报
export function updateNews(data) {
  return request({
    url: '/accident/news/update',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除事故快报
export function delNews(data) {
  return request({
    url: '/accident/news/del',
    method: 'post',
    data: JSON.stringify(data)
  })
}