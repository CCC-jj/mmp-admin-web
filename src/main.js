import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
  } else {
    let getToken = localStorage.getItem('token')
    if (getToken) {
      next()
    } else {
      next('/login')
    }
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
