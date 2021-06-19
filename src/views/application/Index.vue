<template>
  <page-header-wrapper>
    <div class="page-header-index-wide">
      <a-dropdown>
        <a style="color:rgba(0, 0, 0, 0.85);margin:10px;" class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-space>
            切换公众号:<span style="font-size:18px;font-weight:500;">{{appTitle}}</span>
            <span style="color:rgba(0, 0, 0, 0.6);">appid:{{ appid }}</span>
          </a-space>

          <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item key="app1">
            app1
          </a-menu-item>
          <a-menu-item key="app2">
            app2
          </a-menu-item>
          <a-menu-item key="app3">
            app3
          </a-menu-item>
          <a-menu-item key="app4">
            app4
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', margin: '16px 0 0 0', height: '100%' }" :style="{ height: '100%' }">
        <div class="account-settings-info-main" :class="{ 'mobile': isMobile }">
          <div class="account-settings-info-left">
            <a-menu :mode="isMobile ? 'horizontal' : 'inline'" :style="{ border: '0', width: isMobile ? '560px' : 'auto'}" :selectedKeys="selectedKeys" type="inner" @openChange="onOpenChange" @click="onClickItem">
              <a-menu-item key="WxMenu">
                菜单管理
              </a-menu-item>
              <a-menu-item key="WxAssets">
                素材管理
              </a-menu-item>
              <a-menu-item key="MsgReplyRule">
                自动回复规则
              </a-menu-item>
              <a-menu-item key="MsgTemplate">
                模板消息
              </a-menu-item>
              <a-menu-item key="WxQrcode">
                带参二维码
              </a-menu-item>
              <a-menu-item key="WxUser">
                粉丝管理
              </a-menu-item>
              <a-menu-item key="WxMsg">
                公众号消息
              </a-menu-item>
              <!-- <a-menu-item key="WxAccount">
                公众号帐号
              </a-menu-item> -->
            </a-menu>
          </div>
          <div class="account-settings-info-right">
            <!-- <div class="account-settings-info-title">
              <span>
                <a-dropdown>
                  <a style="color:rgba(0, 0, 0, 0.85);font-weight: 600;" class="ant-dropdown-link" @click="e => e.preventDefault()">
                    {{ $t($route.meta.title) }}
                    <a-icon type="down" />
                  </a>
                  <a-menu slot="overlay" @click="onClickItem">
                    <a-menu-item key="WxMenu">
                      公众号管理
                    </a-menu-item>
                    <a-menu-item key="WxAssets">
                      素材管理
                    </a-menu-item>
                    <a-menu-item key="MsgReplyRule">
                      自动回复规则
                    </a-menu-item>
                    <a-menu-item key="MsgTemplate">
                      模板消息
                    </a-menu-item>
                    <a-menu-item key="WxQrcode">
                      带参二维码
                    </a-menu-item>
                    <a-menu-item key="WxUser">
                      粉丝管理
                    </a-menu-item>
                    <a-menu-item key="WxMsg">
                      公众号消息
                    </a-menu-item>
                    <a-menu-item key="WxAccount">
                      公众号帐号
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
            </div> -->
            <route-view></route-view>
          </div>
        </div>
      </a-card>
    </div>
  </page-header-wrapper>
</template>

<script>
import { RouteView } from '@/layouts'
import { baseMixin } from '@/store/app-mixin'
import { mapState } from 'vuex'

export default {
  components: {
    RouteView,
  },
  mixins: [baseMixin],
  data() {
    return {
      // horizontal  inline
      mode: 'inline',

      openKeys: [],
      selectedKeys: [],

      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1],
      },

      pageTitle: '',
    }
  },
  computed: {
    ...mapState({
      appid: (state) => state.wxManage.appid,
      appTitle: (state) => state.wxManage.appTitle,
    }),
    userInfo() {
      return this.$store.getters.userInfo
    },
  },
  mounted() {
    this.updateMenu()
  },
  methods: {
    onOpenChange(openKeys) {
      this.openKeys = openKeys
      this.$router.push({ name: openKeys })
    },
    updateMenu() {
      const name = this.$route.name
      this.selectedKeys = [name]
    },
    onClickItem({ key }) {
      this.$router.push({ name: key })
    },
  },
  watch: {
    $route(val) {
      this.updateMenu()
    },
  },
}
</script>

<style lang="less" scoped>
.account-settings-info-main {
  width: 100%;
  display: flex;
  height: 100%;
  overflow: auto;

  &.mobile {
    display: block;

    .account-settings-info-left {
      border-right: unset;
      border-bottom: 1px solid #e8e8e8;
      width: 100%;
      height: 50px;
      overflow-x: auto;
      overflow-y: scroll;
    }
    .account-settings-info-right {
      padding: 20px 40px;
    }
  }

  .account-settings-info-left {
    border-right: 1px solid #e8e8e8;
    width: 224px;
  }

  .account-settings-info-right {
    flex: 1 1;
    padding: 8px 40px;

    .account-settings-info-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
    .account-settings-info-view {
      padding-top: 12px;
    }
  }
}
</style>
