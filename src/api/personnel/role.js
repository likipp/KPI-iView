import axios from 'axios/index'

const roleList = '/api/roles/';

export function getRoleList (params) {
  return axios({
    url: roleList,
    method: 'get',
    params
  })
}
