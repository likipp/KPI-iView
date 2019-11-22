import axios from 'axios/index'

const position = '/api/position/';

export function getPositionList (params) {
  return axios({
    url: position,
    method: 'get',
    params
  })
}

export function createPosition (params) {
  return axios.post(position, params)
}

export function updatePosition (id, data) {
  return axios({
    url: `/api/position/${id}/`,
    method: 'patch',
    data
  })
}

export function deletePosition (id, data) {
  return axios.delete(`/api/position/${id}/`)
}
