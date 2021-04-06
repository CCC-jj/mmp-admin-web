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
              <a-form-model-item label="参数键名" prop="keyName">
                <a-input placeholder="参数键名" v-model="queryInfo.keyName" />
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
      <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="actionVisible" :title="actionTitle" @ok="actionHandleOk" @cancel="actionHandleCancel" :afterClose="afterClose">
        <template v-if="!viewVisible" slot="footer">
          <a-button key="submit" type="primary" :loading="actionLoading" icon="plus-circle" @click="actionHandleOk">
            保存
          </a-button>
          <a-button key="back" icon="close-circle" @click="actionHandleCancel">
            取消
          </a-button>
        </template>
        <template v-else slot="footer">
          <a-button key="back" type="primary" icon="close-circle" @click="actionHandleCancel">
            关闭
          </a-button>
        </template>
        <a-form-model ref="actionRuleForm" :model="actionForm" :rules="actionRules" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-form-model-item has-feedback label="参数名称" prop="name">
            <a-input :disabled="viewVisible" v-model="actionForm.name" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="参数键名" prop="keyName">
            <a-input :disabled="viewVisible" v-model="actionForm.keyName" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="参数键值" prop="keyValue">
            <a-input :disabled="viewVisible" v-model="actionForm.keyValue" />
          </a-form-model-item>
        </a-form-model>
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

    <!-- 表格数据 -->
    <a-table :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
      <template slot="action" slot-scope="text,record">
        <a-space :size="15">
          <a @click="toView(record)">
            <a-icon type="eye" /> 查看
          </a>
          <a @click="toEdit(record)">
            <a-icon type="edit" /> 编辑
          </a>
          <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.key)">
            <a href="javascript:;">
              <a-icon type="delete" /> 删除
            </a>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '60px',
  },
  {
    title: '参数名称',
    dataIndex: 'name',
  },
  {
    title: '参数键名',
    dataIndex: 'keyName',
  },
  {
    title: '参数键值',
    dataIndex: 'keyValue',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '250px',
  },
]
const dataSource = [
  {
    key: 1,
    name: '是否开启注册功能',
    keyName: 'account.registerUser',
    keyValue: 'true',
  },
  {
    key: 2,
    name: '账号初始密码',
    keyName: 'account.initPassword',
    keyValue: 'AsdF1234!',
  },
  {
    key: 3,
    name: '租户默认管理密码',
    keyName: 'tenant.default.password',
    keyValue: 'admin',
  },
  {
    key: 4,
    name: '账号初始密码',
    keyName: 'tenant.default.accountNumber',
    keyValue: '100',
  },
  {
    key: 5,
    name: '账号初始密码',
    keyName: 'tenant.default.menuCode',
    keyValue: 'desk,flow,work,monitor,resource,role,user,dept,post,dictbiz,topmenu',
  },
]
export default {
  name: 'Param',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        name: '',
        keyName: '',
      },
      queryRules: {},
      // 新增对话框
      actionTitle: '',
      actionVisible: false,
      actionLoading: false,
      actionForm: {
        name: '',
        keyName: '',
        keyValue: '',
      },
      actionRules: {
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        keyName: [{ required: true, message: '请输入参数键名', trigger: 'blur' }],
        keyValue: [{ required: true, message: '请输入参数键值', trigger: 'blur' }],
      },
      // 列显隐
      drawerVisible: false,
      // 穿梭框
      mockData: [
        {
          key: '1',
          title: '参数名称',
          description: 'description of 参数名称',
        },
        {
          key: '2',
          title: '参数键名',
          description: 'description of 参数键名',
        },
        {
          key: '3',
          title: '参数键值',
          description: 'description of 参数键值',
        },
      ],
      targetKeys: ['1', '2', '3'],
      // 表格
      dataSource,
      columns,
      tableLoading: false, //加载中
      selectedRowKeys: [],
      // 查看
      viewVisible: false,
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
      this.actionVisible = true
      this.actionTitle = '新增'
    },
    actionHandleOk() {
      // this.actionLoading = true
      // this.$refs.actionRuleForm.validate((valid) => {
      //   this.actionLoading = false
      //   if (valid) {
      this.actionVisible = false
      //     this.$message.success('新增成功')
      //     this.$refs.actionRuleForm.resetFields()
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    },
    actionHandleCancel() {
      this.actionVisible = false
      // this.$refs.actionRuleForm.resetFields()
    },
    // 对话框关闭
    afterClose() {
      this.viewVisible = false
      this.actionForm = this.$options.data().actionForm
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
    // 勾选表格数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 查看
    toView(record) {
      console.log(record)
      this.actionVisible = true
      this.viewVisible = true
      this.actionTitle = '查看'
      this.actionForm = record
    },
    // 编辑
    toEdit(record) {
      console.log(record)
      this.actionVisible = true
      this.actionTitle = '编辑'
      this.actionForm = record
    },
    // 删除
    onDelete(key) {
      const data = [...this.dataSource]
      this.dataSource = data.filter((item) => item.key !== key)
      this.$message.success('删除成功！')
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