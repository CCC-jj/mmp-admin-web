<template>
  <div class="index">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
        <div class="logo">管理后台</div>
        <a-menu theme="dark" mode="inline" :default-selected-keys="selectedKey" :selectedKeys="selectedKey" @click="clickItem" @openChange="openChangeSub" :openKeys="opensubKey">
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="appstore" />
              <span>subnav 1</span>
            </span>
            <a-menu-item key="2" value="Index">
              首页
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <span slot="title">
              <a-icon type="user" /><span>医生管理</span>
            </span>
            <a-menu-item key="12" value="doctorList">
              医生列表
            </a-menu-item>
            <a-menu-item key="13" value="doctorCheck">
              医生审核
            </a-menu-item>
            <a-menu-item key="14" value="serviceCheck">
              服务审核
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub5">
            <span slot="title">
              <a-icon type="lock" /><span>订单管理</span>
            </span>
            <a-menu-item key="15" value="authRole">
              <a-icon type="user" />问诊单管理
            </a-menu-item>
            <a-menu-item key="16" value="authApi">
              <a-icon type="thunderbolt" />挂号单管理
            </a-menu-item>
            <a-menu-item key="17" value="authMenu">
              <a-icon type="bars" />药品订单管理
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="lock" /><span>权限管理</span>
            </span>
            <a-menu-item key="3" value="authRole">
              <a-icon type="user" />角色管理
            </a-menu-item>
            <a-menu-item key="10" value="authApi">
              <a-icon type="thunderbolt" />接口权限
            </a-menu-item>
            <a-menu-item key="11" value="authMenu">
              <a-icon type="bars" />菜单权限
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title">
              <a-icon type="setting" /><span>系统管理</span>
            </span>
            <a-menu-item key="4" value="User">
              <a-icon type="user" />用户管理
            </a-menu-item>
            <a-menu-item key="5" value="Dict">
              <a-icon type="book" />系统字典
            </a-menu-item>
            <a-menu-item key="6" value="Dictbiz">
              <a-icon type="container" />业务字典
            </a-menu-item>
            <a-menu-item key="7" value="Menu">
              <a-icon type="apartment" />菜单管理
            </a-menu-item>
            <a-menu-item key="8" value="Param">
              <a-icon type="message" />参数管理
            </a-menu-item>
            <a-menu-item key="9" value="Client">
              <a-icon type="appstore" />客户端管理
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="1" value="Account">
            <a-icon type="user" />
            <span>个人中心</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout class="rightLayout">
        <a-layout-header style="background: #fff; padding: 0">
          <div>
            <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
            <!-- <div class="headerUser"> -->
            <!-- <a>admin</a> -->

            <router-link to="/">
              <a-icon type="appstore" theme="filled" style="margin-right:5px;" /> 首页
            </router-link>

          </div>

          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              admin
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <router-link to="/home">首页</router-link>
              </a-menu-item>
              <a-menu-item>
                <router-link to="/account/userInfo">个人信息</router-link>
              </a-menu-item>
              <a-menu-item style="border-top:1px solid #eee;">
                <a @click="logout">退出登录</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>

          <!-- </div> -->
        </a-layout-header>
        <a-layout-content>
          <div class="viewContent">
            <router-view v-if="isRouterAlive"></router-view>
          </div>
          <div style="height:1px;margin:24px;"></div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Index',
  provide() {
    return {
      reloadCard: this.reloadCard,
    }
  },
  data() {
    return {
      isRouterAlive: true,
      collapsed: false,
      selectedKey: [],
      rootSubmenuKeys: ['sub1', 'sub2', 'sub3'],
      opensubKey: ['sub1'],
    }
  },
  watch: {
    // 监听路由
    $route() {
      this.updateMenu()
    },
  },
  mounted() {
    this.updateMenu()
  },
  methods: {
    // 刷新路由组件
    reloadCard() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    // 根据路由更新菜单
    updateMenu() {
      this.selectedKey = [this.$route.meta.key]
      if (this.$route.meta.subMenu) {
        this.opensubKey = [this.$route.meta.subMenu]
      }
    },
    // 选择菜单
    clickItem({ item, key }) {
      this.selectedKey = [key]
      this.$router.push({ name: item.value })
    },
    // 打开一级菜单
    openChangeSub(openKeys) {
      // this.opensubKey = openKeys
      console.log(openKeys)
      const latestOpenKey = openKeys.find((key) => this.opensubKey.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.opensubKey = openKeys
      } else {
        this.opensubKey = latestOpenKey ? [latestOpenKey] : []
      }
    },
    logout() {
      this.$confirm({
        title: '退出确认',
        // centered: true,
        content: '确定要退出系统吗？',
        onOk: () => {
          this.$store
            .dispatch('account/LoginOut')
            .then(() => {
              this.$message.success('退出成功')
              this.$router.push('/login')
            })
            .catch((err) => {
              console.error(err)
            })
        },
        onCancel() {},
      })
    },
  },
}
</script>

<style lang="less" scoped>
#components-layout-demo-custom-trigger {
  height: 100vh;
  .rightLayout {
    // height: 100%;
    .viewContent {
      margin: 24px 16px;
      height: auto;
    }
  }
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #1890ff;
    }
  }
  .logo {
    text-align: center;
    height: 32px;
    line-height: 32px;
    margin: 16px;
    color: #fff;
    overflow: hidden;
  }
  .ant-layout-header {
    float: right;
    display: flex;
    justify-content: space-between;
    // width: ;
    a {
      color: #303133;
      padding: 0 20px;
    }
  }
}
</style>
