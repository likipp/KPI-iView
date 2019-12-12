import axios from 'axios/index'

const data = '/api/dash/'

export function selectData (params) {
  return axios.post(data, params)
}
