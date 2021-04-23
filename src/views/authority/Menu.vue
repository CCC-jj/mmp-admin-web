<template>
  <div class="menu">
    <!-- 搜索栏 -->
    <div style="float:right;">
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
              <a-form-model-item label="菜单编号" prop="no">
                <a-input placeholder="菜单编号" v-model="queryInfo.no" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="6">
                <a-form-model-item label="角色别名" prop="otherName">
                  <a-input placeholder="角色别名" v-model="queryInfo.otherName" />
                </a-form-model-item>
              </a-col> -->
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
        <a-form-model ref="actionRuleForm" :model="actionForm" :rules="actionRules" :label-col="{span:6}" :wrapper-col="{span:18}">
          <a-row>
            <a-col :span="12">
              <a-form-model-item has-feedback label="菜单名称" prop="name">
                <a-input :disabled="viewVisible" v-model="actionForm.name" placeholder="请输入菜单名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item has-feedback label="路由地址" prop="address">
                <a-input :disabled="viewVisible" v-model="actionForm.address" placeholder="请输入路由地址" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="上级菜单" prop="upMenu">
                <a-tree-select :disabled="viewVisible||childVisible" v-model="actionForm.upMenu" :tree-data="upMenuTreeData" show-search style="width: 100%" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择上级菜单" searchPlaceholder="输入关键字进行过滤" allow-clear tree-default-expand-all>
                </a-tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item has-feedback label="菜单图标" prop="icon">
                <a-input :disabled="viewVisible" v-model="actionForm.icon" placeholder="请选择菜单图标" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item has-feedback label="菜单编号" prop="no">
                <a-input :disabled="viewVisible" v-model="actionForm.no" placeholder="请输入菜单编号" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="菜单类型" prop="type">
                <a-radio-group :disabled="viewVisible" name="radioGroup" v-model="actionForm.type">
                  <a-radio value="菜单">
                    菜单
                  </a-radio>
                  <a-radio value="按钮">
                    按钮
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item has-feedback label="菜单别名" prop="otherName">
                <a-input :disabled="viewVisible" v-model="actionForm.otherName" placeholder="请输入菜单别名" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item has-feedback label="菜单排序" prop="sort">
                <a-input-number :disabled="viewVisible" v-model="actionForm.sort" placeholder="请输入菜单排序" style="width: 100%;" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item has-feedback label="菜单备注" :labelCol="{span: 3}" :wrapperCol="{span: 21}" prop="remarke">
                <a-input :disabled="viewVisible" v-model="actionForm.remarke" placeholder="请输入菜单备注" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-space>
            <!-- <a-button type="primary" icon="plus" @click="add">新增</a-button> -->
            <!-- <a-button type="danger" icon="delete">删除</a-button> -->
          </a-space>
        </a-col>
        <a-drawer width="50%" title="列显隐" placement="right" :visible="drawerVisible" :after-visible-change="afterVisibleChange" @close="drawerOnClose">
          <div style="margin:0 auto;">
            <a-transfer :listStyle="{width:'45%',height:'500px'}" :titles="['隐藏','显示']" :data-source="mockData" show-search :filter-option="transferFilterOption" :target-keys="targetKeys" :render="item => item.title" @change="transferHandleChange" @search="transferHandleSearch" />
          </div>
        </a-drawer>
      </a-row>
    </div>

    <!-- 菜单表格 -->
    <div class="table">
      <a-table :expandIconColumnIndex="2" :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="action" slot-scope="text,record">
          <a-space :size="15">
            <!-- <a @click="toView(record)">
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
            <a @click="addChild(record)">
              <a-icon type="plus" /> 新增子项
            </a> -->
            <a @click="authSetting(record)">
              <a-icon type="setting" /> 权限配置
            </a>
          </a-space>
        </template>
      </a-table>
    </div>
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
    title: '菜单名称',
    dataIndex: 'name',
  },
  {
    title: '路由地址',
    dataIndex: 'address',
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
  },
  {
    title: '菜单编号',
    dataIndex: 'no',
  },
  {
    title: '菜单别名',
    dataIndex: 'otherName',
  },
  {
    title: '菜单排序',
    dataIndex: 'sort',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '150px',
  },
]
const dataSource = []
for (let i = 0; i < 8; i++) {
  dataSource.push({
    key: i,
    name: '网关管理',
    address: '/proxy',
    icon: 'QAQ',
    no: 'proxy',
    otherName: 'menu',
    sort: i,
    children: [
      {
        key: i + '1',
        name: '路由管理',
        address: '/proxy/api',
        icon: 'QWQ',
        no: 'proxy_api',
        otherName: 'menu',
        sort: i + 2,
        children: [
          {
            key: i + '12',
            name: '新增',
            address: '/proxy/api',
            icon: 'QWQ',
            no: 'proxy_api',
            otherName: 'menu',
            sort: i + 2,
          },
          {
            key: i + '13',
            name: '新增',
            address: '/proxy/api',
            icon: 'QWQ',
            no: 'proxy_api',
            otherName: 'menu',
            sort: i + 2,
          },
        ],
      },
      {
        key: i + '2',
        name: '路由管理',
        address: '/proxy/api',
        icon: 'QWQ',
        no: 'proxy_api',
        otherName: 'menu',
        sort: i + 2,
      },
    ],
  })
}
export default {
  name: 'authMenu',
	inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        // name: '',
        no: '',
        // otherName: '',
        clientId: '',
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        resName: '',
      },
      queryRules: {},
      // 新增对话框
      actionTitle: '权限配置',
      actionVisible: false,
      actionLoading: false,
      actionForm: {
        name: '',
        address: '',
        upMenu: undefined,
        icon: '',
        no: '',
        type: undefined,
        otherName: '',
        sort: '',
        remarke: '',
      },
      actionRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择菜单图标', trigger: 'change' }],
        no: [{ required: true, message: '请输入菜单编号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
        otherName: [{ required: true, message: '请输入菜单别名', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }],
      },
      // 上级菜单
      upMenuTreeData: [
        {
          title: '系统管理',
          value: '系统管理',
          scopedSlots: { title: 'title' },
          children: [
            { title: '用户管理', value: '用户管理', scopedSlots: { title: 'title' } },
            { title: '机构管理', value: '机构管理', scopedSlots: { title: 'title' } },
          ],
        },
        {
          title: '权限管理',
          value: '权限管理',
          scopedSlots: { title: 'title' },
          children: [
            { title: '角色管理', value: '角色管理', scopedSlots: { title: 'title' } },
            { title: '数据权限', value: '数据权限', scopedSlots: { title: 'title' } },
          ],
        },
        {
          title: '网关管理',
          value: '网关管理',
          scopedSlots: { title: 'title' },
        },
      ],
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
      // 菜单表格
      columns,
      dataSource,
      tableLoading: false,
      selectedRowKeys: [],
      // 查看
      viewVisible: false,
      // 新增子项
      childVisible: false,
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
    afterClose() {
      this.viewVisible = false
      this.childVisible = false
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
    // 勾选表单数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 权限配置
    authSetting(record) {
      console.log(record)
      this.actionVisible = true
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
.menu {
  background: #fff;
  padding: 24px;
	.search {
      height: 65px;
      overflow: hidden;
    }
}
</style>