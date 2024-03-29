import axios from 'axios/index'

axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded'

export function getMenuList (params) {
  return axios({
    url: '/api/menus/',
    method: 'get',
    params
  })
}

export function getMenuTree (params) {
  return axios({
    url: '/api/menu/tree/',
    method: 'get',
    params
  })
}

export function createMenu (params) {
  return axios.post('/api/menus/', params)
}

export function updateMenu (id, data) {
  return axios({
    url: `/api/menus/${id}/`,
    method: 'patch',
    data
  })
}

export function deleteMenu (id, data) {
  return axios.delete(`/api/menus/${id}/`)
}
