<template>
  <div class="param">
    <!-- 搜索栏 -->
    <transition name="mask">
      <div class="search" v-show="search">
        <a-form-model ref="queryRuleForm" :model="queryInfo" :rules="queryRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" @keyup.enter.native="onSubmit">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="参数名称" prop="name">
                <a-input placeholder="参数名称" v-model="queryInfo.name" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="参数键名" prop="otherName">
                <a-input placeholder="参数键名" v-model="queryInfo.otherName" />
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

    <!-- 操作按钮 -->
    <div class="operationButton" style="margin-bottom:20px;">
      <!-- 新增对话框 -->
      <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="addVisible" title="新增" @ok="addHandleOk" @cancel="addHandleCancel">
        <template slot="footer">
          <a-button key="submit" type="primary" :loading="addLoading" icon="plus-circle" @click="addHandleOk">
            保存
          </a-button>
          <a-button key="back" icon="close-circle" @click="addHandleCancel">
            取消
          </a-button>
        </template>
        <!-- <a-form-model ref="addRuleForm" :model="addForm" :rules="addRules" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-form-model-item has-feedback label="角色名称" prop="name">
            <a-input v-model="addForm.name" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="角色别名" prop="otherName">
            <a-input v-model="addForm.otherName" />
          </a-form-model-item>
          <a-form-model-item label="上级角色" prop="superior">
            <a-select v-model="addForm.superior" allowClear show-search placeholder="Select a person" option-filter-prop="children" :filter-option="filterOption">
              <a-select-option value="超级管理员">
                超级管理员
              </a-select-option>
              <a-select-option value="用户">
                用户
              </a-select-option>
              <a-select-option value="管理员">
                管理员
              </a-select-option>
              <a-select-option value="开发人员">
                开发人员
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item has-feedback label="角色排序" prop="sort">
            <a-input-number v-model="addForm.sort" style="width: 100%;" />
          </a-form-model-item>
        </a-form-model> -->
      </a-modal>
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-space>
            <a-button type="primary" icon="plus" @click="add">新增</a-button>
            <a-button type="danger" icon="delete">删除</a-button>
          </a-space>
        </a-col>
        <a-drawer width="50%" title="列显隐" placement="right" :visible="drawerVisible" :after-visible-change="afterVisibleChange" @close="drawerOnClose">
          <div style="margin:0 auto;">
            <a-transfer :listStyle="{width:'45%',height:'500px'}" :titles="['隐藏','显示']" :data-source="mockData" show-search :filter-option="transferFilterOption" :target-keys="targetKeys" :render="item => item.title" @change="transferHandleChange" @search="transferHandleSearch" />
          </div>
        </a-drawer>
        <a-col>
          <a-space>
            <a-tooltip title="刷新">
              <a-button shape="circle" icon="reload" @click="refresh" />
            </a-tooltip>
            <a-tooltip title="显隐">
              <a-button shape="circle" icon="menu-fold" @click="showDrawer" />
            </a-tooltip>
            <a-tooltip title="搜索">
              <a-button shape="circle" icon="search" @click="showSearch" />
            </a-tooltip>
          </a-space>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Param',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        name: '',
        otherName: '',
      },
      queryRules: {},
      // 新增对话框
      addVisible: false,
      addLoading: false,
      // 列显隐
      drawerVisible: false,
      // 穿梭框
      mockData: [
        {
          key: '1',
          title: '所属租户',
          description: 'description of 所属租户',
        },
        {
          key: '2',
          title: '上级角色',
          description: 'description of 上级角色',
        },
        {
          key: '3',
          title: '角色名称',
          description: 'description of 角色名称',
        },
        {
          key: '4',
          title: '角色别名',
          description: 'description of 角色别名',
        },
        {
          key: '5',
          title: '角色排序',
          description: 'description of 角色排序',
        },
      ],
      targetKeys: ['3', '4', '5'],
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
    // 新增
    add() {
      this.addVisible = true
    },
    addHandleOk() {
      // this.addLoading = true
      // this.$refs.addRuleForm.validate((valid) => {
      //   this.addLoading = false
      //   if (valid) {
      this.addVisible = false
      //     this.$message.success('新增成功')
      //     this.$refs.addRuleForm.resetFields()
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    addHandleCancel() {
      this.addVisible = false
      // this.$refs.addRuleForm.resetFields()
    },
    // 刷新此页面
    refresh() {
      this.reloadCard()
    },
    // 列显隐
    showDrawer() {
      this.drawerVisible = true
    },
    drawerOnClose() {
      this.drawerVisible = false
    },
    afterVisibleChange(val) {
      console.log('visible', val)
    },
    // 列显隐穿梭框
    transferFilterOption(inputValue, option) {
      return option.description.indexOf(inputValue) > -1
    },
    transferHandleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys)
      this.targetKeys = targetKeys
    },
    transferHandleSearch(dir, value) {
      console.log('search:', dir, value)
    },
    // 搜索栏显示与隐藏
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
.param {
  background: #fff;
  padding: 24px;
  min-height: 280px;
  .search {
    height: 65px;
    overflow: hidden;
  }
}
</style>