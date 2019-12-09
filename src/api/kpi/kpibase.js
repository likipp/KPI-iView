import axios from 'axios/index'

const kpi = '/api/kpi/';

export function getKPIList (params) {
  return axios({
    url: kpi,
    method: 'get',
    params
  })
}

export function createKPI (params) {
  return axios.post(kpi, params)
}

export function updateKPI (id, data) {
  return axios({
    url: `/api/kpi/${id}/`,
    method: 'patch',
    data
  })
}

export function deleteKPI (id, data) {
  return axios.delete(`/api/kpi/${id}/`)
}
