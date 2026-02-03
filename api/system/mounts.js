import request from '@/utils/request'

// 查询挂架库存列表
export function getMountsList(query) {
  return request({
    url: '/system/mounts/list',
    method: 'get',
    params: query
  })
}

// 根据ID查询挂架库存
export function getMountsById(id) {
  return request({
    url: `/system/mounts/${id}`,
    method: 'get'
  })
}

// 新增挂架库存
export function addMounts(data) {
  return request({
    url: '/system/mounts',
    method: 'post',
    data: data
  })
}

// 修改挂架库存
export function updateMounts(data) {
  return request({
    url: '/system/mounts',
    method: 'put',
    data: data
  })
}

// 删除挂架库存
export function deleteMounts(ids) {
  return request({
    url: `/system/mounts/${ids}`,
    method: 'delete'
  })
}