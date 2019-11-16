import axios from 'axios/index'

const authUrl = '/api/api-token-auth/'
export function Login (data) {
  return axios({
    url: authUrl,
    method: 'post',
    data: data
  })
}

const verfiUrl = '/api/api-token-verify/'
export function Verify (data) {
  return axios({
    url: verfiUrl,
    method: 'post',
    data: data
  })
}

const refreshUrl = '/api/api-token-refresh/'
export function Refresh (data) {
  return axios({
    url: refreshUrl,
    method: 'post',
    data: data
  })
}

// export function ChangePassword (id, data) {
//   return axios({
//     url: `/api/account/change-password/${id}/`,
//     method: 'patch',
//     data
//   })
// }
