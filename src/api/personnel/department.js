import axios from 'axios/index'

axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded'

const department = '/api/organizations/'

export function getDepList (params) {
  return axios({
    url: department,
    method: 'get',
    params
  })
}

export function deleteDep (id, data) {
  return axios.delete(`/api/organizations/${id}/`)
}

export function createDep (params) {
  return axios.post(department, params)
}

export function updateDep (id, data) {
  return axios({
    url: `/api/organizations/${id}/`,
    method: 'patch',
    data
  })
}
