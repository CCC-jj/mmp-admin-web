<template>
  <div class="WxMenu">
    <!-- 搜索栏 -->
    <div style="float:right;">
      <a-space>
        <a-tooltip title="刷新">
          <a-button shape="circle" icon="reload" @click="refresh" />
        </a-tooltip>
        <a-tooltip title="搜索">
          <a-button shape="circle" icon="search" @click="showSearch" />
        </a-tooltip>
      </a-space>
    </div>
    <transition name="mask">
      <div class="search" v-show="search">
        <a-form-model ref="queryRuleForm" :model="queryInfo" :rules="queryRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" @keyup.enter.native="onSubmit">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="菜单名称" prop="resName">
                <a-input placeholder="菜单名称" v-model="queryInfo.resName" />
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item :wrapper-col="{ span: 24, offset: 4 }">
                <a-button style="margin-right:20px;" type="primary" icon="search" @click="onSubmit">
                  搜索
                </a-button>
                <a-button icon="delete" @click="resetForm">
                  清空
                </a-button>
              </a-form-model-item>
            </a-col>

          </a-row>
        </a-form-model>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'WxMenu',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        resName: '',
      },
      queryRules: {},
    }
  },
  methods: {
    // 搜索栏
    onSubmit() {
      this.$refs.queryRuleForm.validate((valid) => {
        if (valid) {
          alert('1')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.queryRuleForm.resetFields()
    },
		// 刷新页面
		refresh() {
      this.reloadCard()
    },
		// 显示搜索栏
    showSearch() {
      this.search = !this.search
    },
  },
}
</script>

<style lang="less" scoped>
@keyframes mask-in {
  0% {
    height: 0;
  }
  100% {
    height: 65px;
  }
}
.mask-enter-active {
  animation: mask-in 0.2s linear;
}
.mask-leave-active {
  animation: mask-in 0.2s reverse linear;
}
.WxMenu {
  background: #fff;
  padding: 24px;
  .search {
    height: 65px;
    overflow: hidden;
  }
}
</style>