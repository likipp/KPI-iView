import axios from 'axios/index'

const permission = '/api/permissions/';

export function getPermission (params) {
  return axios({
    url: permission,
    method: 'get',
    params
  })
}
