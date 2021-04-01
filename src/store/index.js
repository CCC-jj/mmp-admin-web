import Vue from 'vue'
import Vuex from 'vuex'

import dict from './modules/dict.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    dict,
  },
})
