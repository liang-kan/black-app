import request from '@/utils/request'

// 查询电视库存列表
export function getTvsList(query) {
  return request({
    url: '/system/tvs/list',
    method: 'get',
    params: query
  })
}

// 根据ID查询电视库存
export function getTvsById(id) {
  return request({
    url: `/system/tvs/${id}`,
    method: 'get'
  })
}

// 新增电视库存
export function addTvs(data) {
  return request({
    url: '/system/tvs',
    method: 'post',
    data: data
  })
}

// 修改电视库存
export function updateTvs(data) {
  return request({
    url: '/system/tvs',
    method: 'put',
    data: data
  })
}

// 删除电视库存
export function deleteTvs(ids) {
  return request({
    url: `/system/tvs/${ids}`,
    method: 'delete'
  })
}