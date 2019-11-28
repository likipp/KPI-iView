import axios from 'axios/index'

const userList = '/api/users/list';

export function getUserList (params) {
  return axios({
    url: userList,
    method: 'get',
    params
  })
}

const user = '/api/users/';
export function createUser (params) {
  return axios.post(user, params)
}

export function updateUser (id, data) {
  return axios({
    url: `/api/users/${id}/`,
    method: 'patch',
    data
  })
}

export function changePassword (id, data) {
  return axios({
    url: `/api/users/${id}/change-password/`,
    method: 'post',
    data
  })
}

export function deleteUser (id, data) {
  return axios.delete(`/api/users/${id}/`)
}

export function uerInfo (params) {
  return axios({
    url: '/api/users/info',
    method: 'get',
    params
  })
}
