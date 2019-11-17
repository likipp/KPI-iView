// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI, { Message } from 'view-design'
import 'view-design/dist/styles/iview.css'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@/assets/iconfont/iconfont.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import axios from 'axios'
import { getToken } from '@/libs/util'
import { backendMenusToRouters } from './libs/util'
import Cookies from 'js-cookie'
import { setStore, getStore, removeStore } from '@/libs/storage'
import hasRole from '../src/libs/hasRole'
import hasPermission from '../src/libs/hasPermission'
// import TreeTable from 'tree-table-vue'
// import VOrgTree from 'v-org-tree'
// import 'v-org-tree/dist/v-org-tree.css'
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

// Vue.use(iView, {
//   i18n: (key, value) => i18n.t(key, value)
// })
Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.component('v-icon',  Icon);
Vue.use(hasPermission);
Vue.use(hasRole);
// Vue.use(TreeTable)
// Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

axios.interceptors.request.use(
  config => {
    const  token = getToken()
    config.headers.Authorization = `JWT ${token}`
    return config
  }, error => {
    return Promise.reject(error)
  }
)

/* eslint-disable no-new */


const token = getToken()
if (token) {
  store.dispatch('getUserRouters').then(res => {
    if (!store.state.app.routers.length) {
      new Vue({
        el: '#app',
        router,
        i18n,
        store,
        render: h => h(App),
        created () {
          const routers = backendMenusToRouters(res)
          router.addRoutes(routers)
        }
      })
    } else {
      router.addRoutes(store.state.app.routers)
      new Vue({
        el: '#app',
        router,
        i18n,
        store,
        render: h => h(App)
      })
    }
  }).catch((error) => {
    if (error.request.status === 401) {
      Message.error({ background: true, content: '长时间未操作,请重新登录!', closable: true, duration: 5 })
      Cookies.remove('name')
      Cookies.remove('token')
      new Vue({
        el: '#app',
        router,
        i18n,
        store,
        render: h => h(App),
        created () {
          router.push({name: 'login'})
        }
      })
    }
  })
} else {
  new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App),
    created () {
      router.push({name: 'login'})
    }
  })
}




