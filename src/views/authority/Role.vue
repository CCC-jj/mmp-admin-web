<template>
  <div class="role">
    <!-- 搜索栏 -->
    <transition name="mask">
      <div class="search" v-show="search">
        <a-form-model ref="queryRuleForm" :model="queryInfo" :rules="queryRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" @keyup.enter.native="onSubmit">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="角色名称" prop="roleName">
                <a-input placeholder="角色名称" v-model="queryInfo.roleName" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="角色ID" prop="roleId">
                <a-input placeholder="角色ID" v-model="queryInfo.roleId" />
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
      <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="addVisible" title="新增" @ok="addHandleOk" @cancel="addHandleCancel" :afterClose="afterClose">
        <template slot="footer">
          <a-button key="submit" type="primary" :loading="addLoading" icon="plus-circle" @click="addHandleOk">
            保存
          </a-button>
          <a-button key="back" icon="close-circle" @click="addHandleCancel">
            取消
          </a-button>
        </template>
        <a-form-model ref="addRuleForm" :model="addForm" :rules="addRules" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-form-model-item has-feedback label="角色名称" prop="roleName">
            <a-input v-model="addForm.roleName" />
          </a-form-model-item>
          <!-- <a-form-model-item has-feedback label="角色别名" prop="otherName">
            <a-input v-model="addForm.otherName" />
          </a-form-model-item> -->
          <a-form-model-item has-feedback label="上级角色" prop="parentRoleId">
            <a-select v-model="addForm.parentRoleId" allowClear show-search placeholder="请选择上级角色" option-filter-prop="children" :filter-option="filterOption">
              <a-select-option v-for="item in dataSource" :key="item.roleId">
                {{item.roleName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item has-feedback label="角色排序" prop="roleSort">
            <a-input-number v-model="addForm.roleSort" style="width: 100%;" />
          </a-form-model-item>
          <a-form-model-item label="角色状态" prop="roleStatus">
            <a-switch :checked="addForm.roleStatus===1?true:false" @change="(checked,event)=>{addForm.roleStatus=checked?1:2}"></a-switch>
          </a-form-model-item>
          <a-form-model-item label="备注" prop="remark">
            <a-input v-model="addForm.remark" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 角色权限配置对话框 -->
      <a-modal v-model="authorityVisible" title="角色权限配置" @ok="authorityHandleOk">
        <a-tabs default-active-key="1" @change="callback">
          <a-tab-pane key="1" tab="菜单权限">
            <a-tree v-model="checkedKeys" checkable :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :selected-keys="selectedKeys" :tree-data="treeData" @expand="onExpand" @select="onSelect" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="数据权限" force-render>
            Content of Tab Pane 2
          </a-tab-pane>
          <a-tab-pane key="3" tab="接口权限">
            Content of Tab Pane 3
          </a-tab-pane>
        </a-tabs>
      </a-modal>
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-space>
            <a-button type="primary" icon="plus" @click="add">新增</a-button>
            <a-button type="danger" icon="delete">删除</a-button>
            <a-button icon="setting" @click="authoritySetting">权限设置</a-button>
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
    <!-- 角色表格 -->
    <div class="table">
      <a-table :loading="roleLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.roleId}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: queryInfo.limit, total: total, current: queryInfo.page, showTotal: ((total) => {return `共 ${total} 条`}) }" @change="tableChange">
        <template slot="roleStatus" slot-scope="text,record">
          <a-switch :checked="text===1?true:false" @change="(checked,event)=>changeStatus(checked,event,record)"></a-switch>
        </template>
        <template slot="action" slot-scope="text,record">
          <a-space :size="15">
            <a @click="toView(record)">
              <a-icon type="eye" /> 查看
            </a>
            <a @click="toEdit(record)">
              <a-icon type="edit" /> 编辑
            </a>
            <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.roleId)">
              <a href="javascript:;">
                <a-icon type="delete" /> 删除
              </a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
      <a-modal destroyOnClose v-model="viewVisible" title="查看" :footer="null">
        <p>角色名称： {{viewInfo.name}}</p>
        <p>角色别名： {{viewInfo.otherName}}</p>
        <p>上级角色： {{viewInfo.superior}}</p>
        <p>角色名称： {{viewInfo.sort}}</p>
      </a-modal>
      <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="editVisible" title="编辑" @ok="editHandleOk" @cancel="editHandleCancel">
        <template slot="footer">
          <a-button key="submit" type="primary" :loading="editLoading" icon="plus-circle" @click="editHandleOk">
            修改
          </a-button>
          <a-button key="back" icon="close-circle" @click="editHandleCancel">
            取消
          </a-button>
        </template>
        <a-form-model ref="editRuleForm" :model="editForm" :rules="editRules" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-form-model-item has-feedback label="角色名称" prop="name">
            <a-input v-model="editForm.name" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="角色别名" prop="otherName">
            <a-input v-model="editForm.otherName" />
          </a-form-model-item>
          <a-form-model-item label="上级角色" prop="superior">
            <a-select v-model="editForm.superior" allowClear show-search placeholder="Select a person" option-filter-prop="children" :filter-option="filterOption">
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
            <a-input-number v-model="editForm.sort" style="width: 100%;" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getRoleList, activeRole, addRoleList } from '@/api/authority/role'
const columns = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '60px',
  },
  {
    title: '角色ID',
    dataIndex: 'roleId',
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '角色排序',
    dataIndex: 'roleSort',
  },
  {
    title: '角色状态',
    dataIndex: 'roleStatus',
    scopedSlots: { customRender: 'roleStatus' },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  // {
  //   title: '操作',
  //   scopedSlots: { customRender: 'action' },
  //   align: 'center',
  //   width: '250px',
  // },
]
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
]
export default {
  name: 'Role',
  inject: ['reloadCard'],
  data() {
    return {
      queryInfo: {
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        roleId: '',
        roleName: '',
      },
      queryRules: {},
      search: true,
      dataSource: [],
      columns,
      roleLoading: false,
      selectedRowKeys: [],
      total: 0,
      addVisible: false, // 新增对话框
      addLoading: false, // 保存新增
      addForm: {
        roleName: '',
        parentRoleId: undefined,
        roleSort: null,
        roleStatus: 2,
        remark: '',
      },
      addRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        parentRoleId: [{ required: true, message: '请选择上级角色', trigger: 'change' }],
        roleSort: [{ required: true, message: '请输入角色排序', trigger: 'blur' }],
      },
      authorityVisible: false, //角色权限配置
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData,
      drawerVisible: false, // 列显隐
      viewVisible: false, // 查看对话框
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
      viewInfo: {
        name: '',
        otherName: '',
        superior: undefined,
        sort: null,
      },
      editVisible: false, // 编辑对话框
      editForm: {
        name: '',
        otherName: '',
        superior: undefined,
        sort: null,
      },
      editRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        otherName: [{ required: true, message: '请输入角色别名', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入角色排序', trigger: 'blur' }],
      },
      editLoading: false,
    }
  },
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    },
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      this.roleLoading = true
      getRoleList(this.queryInfo)
        .then((res) => {
          console.log(res)
          this.dataSource = res.data
          this.total = res.count
          if (!res.success) {
            this.$message.warning(res.message)
          }
          this.roleLoading = false
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 搜索
    onSubmit() {
      this.queryInfo.page = 1
      this.getTableList()
    },
    resetForm() {
      this.$refs.queryRuleForm.resetFields()
    },
    // 勾选表单数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 翻页等表格操作
    tableChange(pagination) {
      this.queryInfo.page = pagination.current
      this.queryInfo.limit = pagination.pageSize
      this.getTableList()
    },
    // 改变状态开关
    changeStatus(checked, event, record) {
      activeRole(record.roleId)
        .then((res) => {
          if (res.success) {
            record.roleStatus = checked ? 1 : 2
            this.$message.success(checked ? '启用成功' : '禁用成功')
          } else {
            this.$message.warning(res.message)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    add() {
      this.addVisible = true
    },
    addHandleOk() {
      this.$refs.addRuleForm.validate((valid) => {
        if (valid) {
          this.addLoading = true
          addRoleList(this.addForm)
            .then((res) => {
              this.addLoading = false
              if (res.success) {
                this.addVisible = false
                this.$message.success('新增成功')
                this.getTableList()
              } else {
                this.$message.warning(res.message)
              }
            })
            .catch((err) => {
              console.error(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addHandleCancel() {
      this.addVisible = false
    },
    // 对话框关闭后回调
    afterClose() {
      this.viewVisible = false
      this.addForm = this.$options.data().addForm
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    authoritySetting() {
      this.authorityVisible = true
    },
    authorityHandleOk() {
      this.authorityVisible = false
    },
    callback(key) {
      console.log(key)
    },
    // 树形控件
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
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
    // 搜索栏显示与隐藏
    showSearch() {
      this.search = !this.search
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
    // 查看
    toView(record) {
      this.viewInfo = record
      this.viewVisible = true
    },
    // 编辑
    toEdit(record) {
      this.editForm = record
      this.editVisible = true
    },
    editHandleOk() {
      this.editLoading = true
      this.$refs.editRuleForm.validate((valid) => {
        this.editLoading = false
        if (valid) {
          this.editVisible = false
          this.$message.success('新增成功')
          // this.$refs.editRuleForm.resetFields()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editHandleCancel() {
      this.editVisible = false
      // this.$refs.editRuleForm.resetFields()
    },
    // 删除
    onDelete(key) {
      this.$message.success('删除成功！')
      const data = [...this.dataSource]
      this.dataSource = data.filter((item) => item.key !== key)
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
.role {
  background: #fff;
  // margin: 24px 16px;
  // margin-bottom: 24px;
  padding: 24px;
  min-height: 280px;
  .search {
    height: 65px;
    overflow: hidden;
  }
  .table {
    a {
      font-size: 12px;
    }
  }
}
</style>