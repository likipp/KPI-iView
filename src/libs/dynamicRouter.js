// import Cookies from 'js-cookie'
// // import axios from './axios'
// import lazyLoading from './lazyLoading'
// import { getMenuList } from '../api/personnel/menu'
// import { backendMenusToRouters } from './util'
//
// let util = {
//
// }
//
// // const url = () => import(`@/views/${url}.vue`)
//
// util.initRouter = function (vm) {
//   const constRoutes = []
//   const otherRoutes = []
//
//   // 404路由需要和动态路由一起加载
//   const otherRouter = [{
//     path: '*',
//     name: 'error-404',
//     meta: {
//       title: '404-页面不存在'
//     },
//     component: () => import('@/view/error-page/404.vue')
//   }]
//   // 判断用户是否登录
//   let userInfo = Cookies.get('name')
//   if (!userInfo) {
//     // 未登录
//     return
//   }
//   if (!vm.$store.state.app.added) {
//     // 第一次加载 读取数据
//     // let accessToken = window.localStorage.getItem('accessToken')
//     // 加载菜单
//     getMenuList().then(res => {
//       let menuData = res.data
//       let routers = backendMenusToRouters(menuData)
//       vm.$store.commit('setRouters', routers)
//   //     console.log(menuData, 99099993)
//   //     if (!menuData) {
//   //       return
//   //     }
//   //     console.log('初始路由', constRoutes)
//   //     console.log('后端路由数据', menuData)
//   //     util.initAllMenuData(constRoutes, menuData)
//   //     console.log('分析后路由', constRoutes)
//   //     console.log('分析后的后端路由数据', menuData)
//   //     util.initRouterNode(otherRoutes, otherRouter)
//   //     // // 添加所有主界面路由
//   //     // console.log(otherRouter, '其余路由', constRoutes)
//   //     vm.$store.commit('updateAppRouter', menuData.filter(item => item.children.length > 0))
//   //     // // 添加全局路由
//   //     vm.$store.commit('updateDefaultRouter', otherRoutes)
//   //     // 添加菜单路由
//   //     util.initMenuData(vm, menuData)
//   //     // // 缓存数据 修改加载标
//   //     window.localStorage.setItem('menuData', JSON.stringify(menuData))
//   //     vm.$store.commit('setAdded', true)
//   //   })
//   // } else {
//   //   // 读取缓存数据
//   //   let data = window.localStorage.getItem('menuData')
//   //   if (!data) {
//   //     vm.$store.commit('setAdded', false)
//   //     return
//   //   }
//   //   let menuData = JSON.parse(data)
//   //   // 添加菜单路由
//   //   util.initMenuData(vm, menuData)
//   }
// }
// // 添加所有顶部导航栏下的菜单路由
// // util.initAllMenuData = function (constRoutes, data) {
// //   let allMenuData = []
// //   data.forEach(e => {
// //     if (e.pid === null) {
// //       e.children.forEach(item => {
// //         allMenuData.push(item)
// //       })
// //     }
// //   })
// //   console.log('过程中的constRoutes', constRoutes)
// //   util.initRouterNode(constRoutes, allMenuData)
// // }
// //
// // // 生成菜单格式数据
// // util.initMenuData = function (vm, data) {
// //   let item
// //   const menuRoutes = []
// //   let menuData = data
// //   // 顶部菜单
// //   let navList = []
// //   menuData.forEach(e => {
// //     let nav = {
// //       name: e.name,
// //       title: e.meta.title,
// //       icon: e.meta.icon
// //     }
// //     navList.push(nav)
// //   })
// //   if (navList.length < 1) {
// //     return
// //   }
// //   // 存入vuex
// //   vm.$store.commit('setNavList', navList)
// //   let currNav = window.localStorage.getItem('currNav')
// //   if (currNav) {
// //     // 读取缓存title
// //     for (item of navList) {
// //       if (item.name === currNav) {
// //         vm.$store.commit('setCurrNavTitle', item.title)
// //         break
// //       }
// //     }
// //   } else {
// //     // 默认第一个
// //     currNav = navList[0].name
// //     vm.$store.commit('setCurrNavTitle', navList[0].title)
// //   }
// //   vm.$store.commit('setCurrNav', currNav)
// //   for (item of menuData) {
// //     if (item.name === currNav) {
// //       // 过滤
// //       menuData = item.children
// //       break
// //     }
// //   }
// //   util.initRouterNode(menuRoutes, menuData)
// //   // 刷新界面菜单
// //   vm.$store.commit('updateMenulist', menuRoutes.filter(item => item.children.length > 0))
// //   let tagsList = []
// //   vm.$store.state.app.routers.map((item) => {
// //     if (item.children.length <= 1) {
// //       tagsList.push(item.children[0])
// //     } else {
// //       tagsList.push(...item.children)
// //     }
// //   })
// //   vm.$store.commit('setTagsList', tagsList)
// // }
// //
// // // 生成路由节点
// // util.initRouterNode = function (routers, data) {
// //   for (const item of data) {
// //     let menu = Object.assign({}, item)
// //     menu.component = lazyLoading(menu.component)
// //     if (item.children && item.children.length > 0) {
// //       menu.children = []
// //       util.initRouterNode(menu.children, item.children)
// //     }
// //     // let meta = {}
// //     // 给页面添加权限、标题、第三方网页链接
// //     // meta.permTypes = menu.permTypes ? menu.permTypes : null
// //     // meta.title = menu.title ? menu.title + '- XBoot前后端分离开发平台 By: Exrick' : null
// //     // meta.url = menu.url ? menu.url : null
// //     // menu.meta = meta
// //     routers.push(menu)
// //   }
// }
// export default util
