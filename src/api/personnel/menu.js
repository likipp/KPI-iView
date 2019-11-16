import axios from 'axios/index'

axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded'

export function getMenuList (params) {
  return axios({
    url: '/api/menus/',
    method: 'get',
    params
  })
}
