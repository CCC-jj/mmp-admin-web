import Vue from 'vue'
import Vuex from 'vuex'

import dict from './modules/dict.js'
import account from './modules/account.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    account,
    dict,
  },
})
