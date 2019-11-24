import axios from 'axios/index'

const permission = '/api/permissions/';

export function getPermission (params) {
  return axios({
    url: permission,
    method: 'get',
    params
  })
}

export function getPermissionTree (params) {
  return axios({
    url: `/api/permission/tree/`,
    method: 'get',
    params
  })
}

export function createPermission (params) {
  return axios.post(permission, params)
}

export function updatePermission (id, data) {
  return axios({
    url: `/api/permissions/${id}/`,
    method: 'patch',
    data
  })
}

export function deletePermission (id, data) {
  return axios.delete(`/api/permissions/${id}/`)
}
