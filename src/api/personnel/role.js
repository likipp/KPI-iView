import axios from 'axios/index'

const role = '/api/roles/';

export function getRoleList (params) {
  return axios({
    url: role,
    method: 'get',
    params
  })
}

export function getRoleTree (params) {
  return axios({
    url: '/api/role/tree/',
    method: 'get',
    params
  })
}

export function createRole (params) {
  return axios.post(role, params)
}

export function updateRole (id, data) {
  return axios({
    url: `/api/roles/${id}/`,
    method: 'patch',
    data
  })
}

export function deleteRole (id, data) {
  return axios.delete(`/api/roles/${id}/`)
}

export function updateRolePermission (id, data) {
  return axios({
    url: `/api/roles/${id}/delete-role-permission/`,
    method: 'patch',
    data
  })
}

export function getRoleSingle (id) {
  return axios({
    url: `/api/role_permission/${id}/`,
    method: 'get'
  })
}

export function getSelectPermissions (id, params) {
  return axios({
    url: `/api/role_permission/${id}/get-permission/`,
    method: 'get',
    params
  })
}
