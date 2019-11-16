import axios from 'axios/index'

const organizationtree = '/api/organization/tree/'

export function getOrganizationTree (params) {
  return axios({
    url: organizationtree,
    method: 'get',
    params
  })
}

const usertree = '/api/organization/user/tree/'

export function getUserTree (params) {
  return axios({
    url: usertree,
    method: 'get',
    params
  })
}
