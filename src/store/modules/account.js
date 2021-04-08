import md5 from 'md5'
import Vue from 'vue'
import { Login, Logout } from '@/api/account'
export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: {},
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },
  },
  actions: {
    LoginByUsername({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      let timestamp = Math.round(new Date().getTime() / 1000)
      let sign = md5(timestamp + ':123456')
      return new Promise((resolve, reject) => {
        Login(sign, timestamp, 1, userInfo.username, userInfo.password)
          .then((res) => {
            if (res.success) {
              commit('SET_TOKEN', res.data)
              localStorage.setItem('token', res.data)
              resolve()
            } else {
              Vue.prototype.$message.warning(res.message)
              reject()
            }
          })
          .catch((err) => {
            console.error(err)
          })
      })
    },
    LoginOut({ commit }) {
      let timestamp = Math.round(new Date().getTime() / 1000)
      let sign = md5(timestamp + ':123456')
      return new Promise((resolve, reject) => {
        Logout(sign, timestamp)
          .then((res) => {
            if (res.success) {
              commit('SET_TOKEN', '')
              localStorage.removeItem('token')
              resolve()
            } else {
              Vue.prototype.$message.warning(res.message)
              reject()
            }
          })
          .catch((err) => {
            console.error(err)
          })
      })
    },
  },
}
