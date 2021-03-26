<template>
  <div class="account">
    <div class="accountTabs">
      <a-menu mode="inline" :style="{ border: '0', width:'auto'}" :selectedKeys="selectedKeys" type="inner" @select="selectMenu" @openChange="onOpenChange">
        <a-menu-item key="1">
          <router-link :to="{ name: 'UserInfo' }">
            个人信息
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link :to="{ name: 'AppInfo' }">
            应用信息
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link :to="{ name: 'ChangePwd' }">
            修改密码
          </router-link>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="accountBox">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data() {
    return {
      value: 'UserInfo',
      radioStyle: {
        display: 'block',
        height: '45px',
        lineHeight: '45px',
      },
      selectedKeys: [],
    }
  },
  watch: {
    $route() {
      this.updateMenu()
    },
  },
	mounted() {
		this.updateMenu()
	},
  methods: {
    onOpenChange(openKeys) {
      this.openKeys = openKeys
    },
    selectMenu({ key }) {
      this.selectedKeys = [key]
    },
    updateMenu() {
      let name = this.$route.name
      switch (name) {
        case 'UserInfo':
          this.selectedKeys = ['1']
          break
        case 'AppInfo':
          this.selectedKeys = ['2']
          break
        case 'ChangePwd':
          this.selectedKeys = ['3']
      }
    },
  },
}
</script>

<style scoped>
.account {
  background: #fff;
  padding: 24px;
  display: flex;
  min-height: 280px;
  justify-content: space-between;
}
.accountTabs {
  width: 15%;
}
.accountBox {
  width: 80%;
}
</style>