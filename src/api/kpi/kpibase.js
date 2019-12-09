import axios from 'axios/index'

const kpi = '/api/kpi/';

export function getKPIList (params) {
  return axios({
    url: kpi,
    method: 'get',
    params
  })
}
