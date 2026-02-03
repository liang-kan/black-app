import request from '@/utils/request'

// 查询灯条库存列表
export function getLedStripsList(query) {
  return request({
    url: '/system/ledStrips/list',
    method: 'get',
    params: query
  })
}

// 根据ID查询灯条库存
export function getLedStripsById(id) {
  return request({
    url: `/system/ledStrips/${id}`,
    method: 'get'
  })
}

// 新增灯条库存
export function addLedStrips(data) {
  return request({
    url: '/system/ledStrips',
    method: 'post',
    data: data
  })
}

// 修改灯条库存
export function updateLedStrips(data) {
  return request({
    url: '/system/ledStrips',
    method: 'put',
    data: data
  })
}

// 删除灯条库存
export function deleteLedStrips(ids) {
  return request({
    url: `/system/ledStrips/${ids}`,
    method: 'delete'
  })
}