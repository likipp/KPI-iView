import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import users from './module/users'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  getters: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    users
  }
})
