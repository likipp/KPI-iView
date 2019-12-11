import axios from 'axios/index'

const input = '/api/kpiinput/'

export function getInputList (params) {
  return axios({
    url: input,
    method: 'get',
    params
  })
}

export function createInput (data) {
  return axios.post(input, data)
}
