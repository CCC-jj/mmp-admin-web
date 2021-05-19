// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
        children: [
          {
            path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['dashboard'] }
          },
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            name: 'Monitor',
            meta: { title: 'menu.dashboard.monitor', target: '_blank' }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['dashboard'] }
          }
        ]
      },
      // doctorManage
      {
        path: '/doctorManage',
        name: 'doctorManage',
        redirect: '/doctorManage/doctorList',
        component: RouteView,
        meta: { title: '医生管理', icon: 'user', permission: ['doctorManage'] },
        children: [
          {
            path: '/doctorManage/doctorList',
            name: 'DoctorList',
            component: () => import('@/views/doctorManage/DoctorList'),
            meta: { title: '医生列表', keepAlive: true, permission: ['doctorManage'] }
          },
          {
            path: '/doctorManage/doctorCheck',
            name: 'DoctorCheck',
            component: () => import('@/views/doctorManage/DoctorCheck'),
            meta: { title: '医生审核', keepAlive: true, permission: ['doctorManage'] }
          },
          {
            path: '/doctorManage/serviceCheck',
            name: 'ServiceCheck',
            component: () => import('@/views/doctorManage/ServiceCheck'),
            meta: { title: '服务审核', keepAlive: true, permission: ['doctorManage'] }
          },
        ]
      },
      // orderManage
      {
        path: '/orderManage',
        name: 'orderManage',
        redirect: '/orderManage/questionnaire',
        component: RouteView,
        meta: { title: '订单管理', icon: 'lock', permission: ['orderManage'] },
        children: [
          {
            path: '/orderManage/questionnaire',
            name: 'Questionnaire',
            component: () => import('@/views/orderManage/Questionnaire'),
            meta: { title: '问诊单管理', keepAlive: true, permission: ['orderManage'] }
          },
          {
            path: '/orderManage/registeredOrder',
            name: 'RegisteredOrder',
            component: () => import('@/views/orderManage/RegisteredOrder'),
            meta: { title: '挂号单管理', keepAlive: true, permission: ['orderManage'] }
          },
          {
            path: '/orderManage/refundApply',
            name: 'RefundApply',
            component: () => import('@/views/orderManage/RefundApply'),
            meta: { title: '退款申请', keepAlive: true, permission: ['orderManage'] }
          },
        ]
      },
      // commodityManage
      {
        path: '/commodityManage',
        name: 'commodityManage',
        redirect: '/commodityManage/drugList',
        component: RouteView,
        meta: { title: '商品管理', icon: 'trademark', permission: ['commodityManage'] },
        children: [
          {
            path: '/commodityManage/drugList',
            name: 'DrugList',
            component: () => import('@/views/commodityManage/DrugList'),
            meta: { title: '药品列表', keepAlive: true, permission: ['commodityManage'] }
          },
          {
            path: '/commodityManage/drugSort',
            name: 'DrugSort',
            component: () => import('@/views/commodityManage/DrugSort'),
            meta: { title: '药品分类', keepAlive: true, permission: ['commodityManage'] }
          },
          {
            path: '/commodityManage/drugCheck',
            name: 'DrugCheck',
            component: () => import('@/views/commodityManage/DrugCheck'),
            meta: { title: '药品审核', keepAlive: true, permission: ['commodityManage'] }
          },
        ]
      },
      // contentManage
      {
        path: '/contentManage',
        name: 'contentManage',
        redirect: '/contentManage/hospital',
        component: RouteView,
        meta: { title: '内容管理', icon: 'container', permission: ['contentManage'] },
        children: [
          {
            path: '/contentManage/hospital',
            name: 'HospitalManage',
            component: () => import('@/views/contentManage/HospitalManage'),
            meta: { title: '医院管理', keepAlive: true, permission: ['contentManage'] }
          },
        ]
      },
      // authority
      {
        path: '/authority',
        name: 'authority',
        redirect: '/authority/role',
        component: RouteView,
        meta: { title: '权限管理', icon: 'lock', permission: ['authority'] },
        children: [
          {
            path: '/authority/role',
            name: 'Role',
            component: () => import('@/views/authority/Role'),
            meta: { title: '角色管理', keepAlive: true, permission: ['authority'] }
          },
          {
            path: '/authority/api',
            name: 'AuthApi',
            component: () => import('@/views/authority/Api'),
            meta: { title: '接口权限', keepAlive: true, permission: ['authority'] }
          },
          {
            path: '/authority/menu',
            name: 'AuthMenu',
            component: () => import('@/views/authority/Menu'),
            meta: { title: '菜单权限', keepAlive: true, permission: ['authority'] }
          },
        ]
      },
      // system
      {
        path: '/system',
        name: 'system',
        redirect: '/system/user',
        component: RouteView,
        meta: { title: '系统管理', icon: 'setting', permission: ['system'] },
        children: [
          {
            path: '/system/user',
            name: 'User',
            component: () => import('@/views/system/User'),
            meta: { title: '用户管理', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/system/dict',
            name: 'Dict',
            component: () => import('@/views/system/Dict'),
            meta: { title: '系统字典', keepAlive: true, permission: ['system'] },
          },
          // {
          //   path: '/system/dictbiz',
          //   name: 'Dictbiz',
          //   component: () => import('@/views/system/Dictbiz.vue'),
          //   meta: { title: '业务字典', keepAlive: true, permission: ['system'] }
          // },
          {
            path: '/system/menu',
            name: 'Menu',
            component: () => import('@/views/system/Menu'),
            meta: { title: '菜单管理', keepAlive: true, permission: ['system'] },
          },
          {
            path: '/system/param',
            name: 'Param',
            component: () => import('@/views/system/Param'),
            meta: { title: '参数管理', keepAlive: true, permission: ['system'] }
          },
          {
            path: '/system/client',
            name: 'Client',
            component: () => import('@/views/system/Client'),
            meta: { title: '客户端管理', keepAlive: true, permission: ['system'] }
          },
        ]
      },
      // wxManage
      {
        path: '/wxManage',
        name: 'wxManage',
        redirect: '/wxManage/wxMenu',
        component: RouteView,
        meta: { title: '微信管理', icon: 'message', permission: ['wxManage'] },
        children: [
          {
            path: '/wxManage/wxMenu',
            name: 'WxMenu',
            component: () => import('@/views/application/wxManage/WxMenu'),
            meta: { title: '公众号管理', keepAlive: true, permission: ['wxManage'] }
          },
          {
            path: '/wxManage/wxMaterial',
            name: 'WxMaterial',
            component: () => import('@/views/application/wxManage/WxMaterial'),
            meta: { title: '素材管理', keepAlive: true, permission: ['wxManage'] }
          },
        ]
      },
      // forms
      {
        path: '/form',
        redirect: '/form/base-form',
        component: RouteView,
        meta: { title: 'menu.form', icon: 'form', permission: ['form'] },
        children: [
          {
            path: '/form/base-form',
            name: 'BaseForm',
            component: () => import('@/views/form/basicForm'),
            meta: { title: 'menu.form.basic-form', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/form/step-form',
            name: 'StepForm',
            component: () => import('@/views/form/stepForm/StepForm'),
            meta: { title: 'menu.form.step-form', keepAlive: true, permission: ['form'] }
          },
          {
            path: '/form/advanced-form',
            name: 'AdvanceForm',
            component: () => import('@/views/form/advancedForm/AdvancedForm'),
            meta: { title: 'menu.form.advanced-form', keepAlive: true, permission: ['form'] }
          }
        ]
      },
      // list
      {
        path: '/list',
        name: 'list',
        component: RouteView,
        redirect: '/list/table-list',
        meta: { title: 'menu.list', icon: 'table', permission: ['table'] },
        children: [
          {
            path: '/list/table-list/:pageNo([1-9]\\d*)?',
            name: 'TableListWrapper',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/list/TableList'),
            meta: { title: 'menu.list.table-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/basic-list',
            name: 'BasicList',
            component: () => import('@/views/list/BasicList'),
            meta: { title: 'menu.list.basic-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/card',
            name: 'CardList',
            component: () => import('@/views/list/CardList'),
            meta: { title: 'menu.list.card-list', keepAlive: true, permission: ['table'] }
          },
          {
            path: '/list/search',
            name: 'SearchList',
            component: () => import('@/views/list/search/SearchLayout'),
            redirect: '/list/search/article',
            meta: { title: 'menu.list.search-list', keepAlive: true, permission: ['table'] },
            children: [
              {
                path: '/list/search/article',
                name: 'SearchArticles',
                component: () => import('@/views/list/search/Article'),
                meta: { title: 'menu.list.search-list.articles', permission: ['table'] }
              },
              {
                path: '/list/search/project',
                name: 'SearchProjects',
                component: () => import('@/views/list/search/Projects'),
                meta: { title: 'menu.list.search-list.projects', permission: ['table'] }
              },
              {
                path: '/list/search/application',
                name: 'SearchApplications',
                component: () => import('@/views/list/search/Applications'),
                meta: { title: 'menu.list.search-list.applications', permission: ['table'] }
              }
            ]
          }
        ]
      },

      // profile
      {
        path: '/profile',
        name: 'profile',
        component: RouteView,
        redirect: '/profile/basic',
        meta: { title: 'menu.profile', icon: 'profile', permission: ['profile'] },
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic'),
            meta: { title: 'menu.profile.basic', permission: ['profile'] }
          },
          {
            path: '/profile/advanced',
            name: 'ProfileAdvanced',
            component: () => import('@/views/profile/advanced/Advanced'),
            meta: { title: 'menu.profile.advanced', permission: ['profile'] }
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: { title: 'menu.result', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: 'menu.result.success', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: 'menu.result.fail', keepAlive: false, hiddenHeaderContent: true, permission: ['result'] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['exception'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: 'menu.account.center', keepAlive: true, permission: ['user'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['user'] },
            redirect: '/account/settings/BasicSettings',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/BasicSettings',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['user'] }
              },
              {
                path: '/account/settings/SecuritySettings',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              },
              {
                path: '/account/settings/CustomSettings',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/BindingSettings',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['user'] }
              },
              {
                path: '/account/settings/NotificationSettings',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['user']
                }
              }
            ]
          }
        ]
      }

      // other
      /*
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
          }
        ]
      }
      */
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
