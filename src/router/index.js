import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import ViewUI from 'view-design'
import { setToken, getToken, setTitle } from '@/libs/util'
// import config from '@/config'
// const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

// const turnTo = (to, access, next) => {
//   if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
//   else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
// }

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  const token = getToken();
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token) {
    store.dispatch('authorization', token).then(() => {
      store.dispatch('getUserInfo').then(user => {
        // setStore('roles', res.role);
        next()
      })
    }).catch(() => {
      Message.info({ background: true, content: 'Token已过期,请重新登录', closable: true, duration: 10 });
      setToken('')
      next({
        name: LOGIN_PAGE_NAME
      })
    })
  } else {
    next({
      name: LOGIN_PAGE_NAME
    })
  }
})

router.afterEach(to => {
  setTitle(to, router.app);
  ViewUI.LoadingBar.finish();
  window.scrollTo(0, 0)
})

export default router
