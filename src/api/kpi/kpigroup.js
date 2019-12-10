import axios from 'axios/index'

const kpiGroup = '/api/group_kpi/'

export function getGroupKPIList (params) {
  return axios({
    url: kpiGroup,
    method: 'get',
    params
  })
}

export function createGroupKPI (data) {
  return axios.post(kpiGroup, data)
}

export function updateGroupKPI (id, data) {
  return axios({
    url: `/api/group_kpi/${id}/`,
    method: 'patch',
    data
  })
}

export function deleteGroupKPI (id, data) {
  return axios.delete(`/api/group_kpi/${id}/`)
}

export function getGroupKPIUnused (id, params) {
  return axios({
    url: `/api/kpi/${id}/unused/`,
    method: 'get',
    params
  })
}
