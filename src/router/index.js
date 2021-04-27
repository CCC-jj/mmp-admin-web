import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
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
    name: 'Index',
    component: Index,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
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
        path: '/doctorManage/doctorList',
        name: 'DoctorList',
        component: () => import('../views/doctorManage/DoctorList.vue'),
        meta: { title: '医生列表', key: '12', path: 'DoctorList', subMenu: 'sub4' }
      },
      {
        path: '/doctorManage/doctorCheck',
        name: 'DoctorCheck',
        component: () => import('../views/doctorManage/DoctorCheck.vue'),
        meta: { title: '医生审核', key: '13', path: 'DoctorCheck', subMenu: 'sub4' }
      },
      {
        path: '/doctorManage/serviceCheck',
        name: 'ServiceCheck',
        component: () => import('../views/doctorManage/ServiceCheck.vue'),
        meta: { title: '服务审核', key: '14', path: 'ServiceCheck', subMenu: 'sub4' }
      },
      {
        path: '/orderManage/questionnaire',
        name: 'Questionnaire',
        component: () => import('../views/orderManage/Questionnaire.vue'),
        meta: { title: '问诊单管理', key: '15', path: 'Questionnaire', subMenu: 'sub5' }
      },
      {
        path: '/orderManage/registeredOrder',
        name: 'RegisteredOrder',
        component: () => import('../views/orderManage/RegisteredOrder.vue'),
        meta: { title: '挂号单管理', key: '16', path: 'RegisteredOrder', subMenu: 'sub5' }
      },
      {
        path: '/orderManage/refundApply',
        name: 'RefundApply',
        component: () => import('../views/orderManage/RefundApply.vue'),
        meta: { title: '退款申请', key: '19', path: 'RefundApply', subMenu: 'sub5' }
      },
      {
        path: '/commodityManage/drugList',
        name: 'DrugList',
        component: () => import('../views/commodityManage/DrugList.vue'),
        meta: { title: '药品列表', key: '20', path: 'DrugList', subMenu: 'sub6' }
      },
      {
        path: '/commodityManage/drugSort',
        name: 'DrugSort',
        component: () => import('../views/commodityManage/DrugSort.vue'),
        meta: { title: '药品分类', key: '21', path: 'DrugSort', subMenu: 'sub6' }
      },
      {
        path: '/commodityManage/drugCheck',
        name: 'DrugCheck',
        component: () => import('../views/commodityManage/DrugCheck.vue'),
        meta: { title: '药品审核', key: '22', path: 'DrugCheck', subMenu: 'sub6' }
      },
      {
        path: '/contentManage/hospital',
        name: 'HospitalManage',
        component: () => import('../views/contentManage/HospitalManage.vue'),
        meta: { title: '医院管理', key: '23', path: 'HospitalManage', subMenu: 'sub7' }
      },
      {
        path: '/authority/role',
        name: 'AuthRole',
        component: () => import('../views/authority/Role.vue'),
        meta: { title: '角色管理', key: '3', path: 'AuthRole', subMenu: 'sub2' },
      },
      {
        path: '/authority/api',
        name: 'AuthApi',
        component: () => import('../views/authority/Api.vue'),
        meta: { title: '接口权限', key: '10', path: 'AuthApi', subMenu: 'sub2' },
      },
      {
        path: '/authority/role',
        name: 'AuthMenu',
        component: () => import('../views/authority/Menu.vue'),
        meta: { title: '菜单权限', key: '11', path: 'AuthMenu', subMenu: 'sub2' },
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
      {
        path: '/wxManage/wxMenu',
        name: 'WxMenu',
        component: () => import('../views/wxManage/WxMenu.vue'),
        meta: { title: '公众号菜单', key: '24', path: 'WxMenu', subMenu: 'sub8' },
      },
      {
        path: '/wxManage/wxMaterial',
        name: 'WxMaterial',
        component: () => import('../views/wxManage/WxMaterial.vue'),
        meta: { title: '素材管理', key: '25', path: 'WxMaterial', subMenu: 'sub8' },
      }
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
