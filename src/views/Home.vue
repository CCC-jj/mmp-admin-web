<template>
  <div class="home">
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
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="lock" /><span>权限管理</span>
            </span>
            <a-menu-item key="3" value="Role">
              <a-icon type="user" />角色管理
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
          </a-sub-menu>
          <a-menu-item key="1" value="Account">
            <a-icon type="user" />
            <span>个人中心</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout class="rightLayout">
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
          <div class="headerUser">
            <a>admin</a>
            <router-link to="/">首页</router-link>
            <router-link to="/login">退出</router-link>
          </div>
        </a-layout-header>
        <a-layout-content :style="{  }">
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
  name: 'Home',
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
  .headerUser {
    float: right;
    display: flex;
    a {
      padding: 0 20px;
    }
  }
}
</style>
