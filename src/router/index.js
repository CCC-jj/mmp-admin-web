import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/account/Login.vue'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Index',
        component: () => import('../views/index.vue'),
        meta: { title: '首页', key: '2', path: 'Index', subMenu: 'sub1' },
      },
      {
        path: '/account',
        name: 'Account',
        component: () => import('../views/account/index.vue'),
        redirect: '/account/userInfo',
        meta: { title: '个人中心', key: '1', path: 'Account' },
        children: [
          {
            path: '/account/userInfo',
            name: 'UserInfo',
            component: () => import('../views/account/UserInfo.vue'),
            meta: { title: '个人中心', key: '1', path: 'Account' },
          },
          {
            path: '/account/appInfo',
            name: 'AppInfo',
            component: () => import('../views/account/AppInfo.vue'),
            meta: { title: '个人中心', key: '1', path: 'Account' },
          },
          {
            path: '/account/changePwd',
            name: 'ChangePwd',
            component: () => import('../views/account/ChangePwd.vue'),
            meta: { title: '个人中心', key: '1', path: 'Account' },
          },
        ],
      },
      {
        path: '/authority/role',
        name: 'Role',
        component: () => import('../views/authority/Role.vue'),
        meta: { title: '角色管理', key: '3', path: 'Role', subMenu: 'sub2' },
      },
      {
        path: '/system/user',
        name: 'User',
        component: () => import('../views/system/User.vue'),
        meta: { title: '用户管理', key: '4', path: 'User', subMenu: 'sub3' },
      },
      {
        path: '/system/dict',
        name: 'Dict',
        component: () => import('../views/system/Dict.vue'),
        meta: { title: '系统字典', key: '5', path: 'Dict', subMenu: 'sub3' },
      },
      {
        path: '/system/dictbiz',
        name: 'Dictbiz',
        component: () => import('../views/system/Dictbiz.vue'),
        meta: { title: '业务字典', key: '6', path: 'Dictbiz', subMenu: 'sub3' },
      },
      {
        path: '/system/menu',
        name: 'Menu',
        component: () => import('../views/system/Menu.vue'),
        meta: { title: '菜单管理', key: '7', path: 'Menu', subMenu: 'sub3' },
      },
      {
        path: '/system/param',
        name: 'Param',
        component: () => import('../views/system/Param.vue'),
        meta: { title: '参数管理', key: '8', path: 'Param', subMenu: 'sub3' },
      },
      {
        path: '/system/client',
        name: 'Client',
        component: () => import('../views/system/Client.vue'),
        meta: { title: '客户端管理', key: '9', path: 'Client', subMenu: 'sub3' },
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
