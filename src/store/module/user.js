import { Login, Verify, Refresh } from '@/api/login'
import { setToken, getToken } from '@/libs/util'
import Cookies from 'js-cookie'
import { uerInfo } from '../../api/personnel/user'
import { setStore } from '../../libs/storage';

// import { backendMenusToRouters } from '../../libs/util'
// import router from '../../router'
// import { getMenuList } from '../../api/personnel/menu'
// import { backendMenusToRouters, getMenuByRouter, localSave } from '../../libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    // access: '',
    hasGetInfo: false
    // unreadCount: 0,
    // messageUnreadList: [],
    // messageReadedList: [],
    // messageTrashList: [],
    // messageContentStore: {}
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    // setAccess (state, access) {
    //   state.access = access
    // },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
    // setHasGetInfo (state, status) {
    //   state.hasGetInfo = status
    // }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        Login({ username, password }).then(res => {
          Cookies.set('name', username);
          commit('setToken', res.data.token);
          setStore('roles', res.roles);
          resolve()
        }).catch(error => {
          reject(new Error('用户名或者密码错误'), error)
        })
      })
    },
    // 认证
    authorization ({ commit }, token) {
      return new Promise((resolve, reject) => {
        Verify({ token }).then(res => {
          if (parseInt(res.status) === 400) {
            Cookies.remove('token');
            Cookies.remove('name');
            reject(new Error('token已过期'))
          } else {
            Refresh({ token }).then(res => {
              setToken(res.data.token);
              resolve()
            })
          }
        }).catch((error) => {
          reject(error)
        })
      })
    },
    // 刷新
    // refresh ({ commit }, token) {
    //   return new Promise((resolve, reject) => {
    //     Refresh({ token }).then(res => {
    //     })
    //   })
    // },
    // 退出登录
    // handleLogOut ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     logout().then(() => {
    //       commit('setToken', '')
    //       // commit('setAccess', [])
    //       resolve()
    //     }).catch(err => {
    //       reject(err)
    //     })
    //     // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
    //     // commit('setToken', '')
    //     // commit('setAccess', [])
    //     // resolve()
    //   })
    // },
    Logout () {
      // setToken('')
      Cookies.remove('name')
      Cookies.remove('token')
      localStorage.clear()
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          uerInfo(state.token).then(res => {
            const data = res.data
            setStore('roles', data.roles);
            commit('setAvator', data.avatar);
            commit('setUserName', data.name);
            commit('setUserId', data.user_id);
            resolve(res.data)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
