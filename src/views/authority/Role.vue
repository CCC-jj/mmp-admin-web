<template>
  <div class="role">
    <div class="search" v-show="search">
      <a-form-model ref="ruleForm" :model="queryInfo" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="6">
            <a-form-model-item label="角色名称" prop="name">
              <a-input placeholder="角色名称" v-model="queryInfo.name" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="角色别名" prop="otherName">
              <a-input placeholder="角色别名" v-model="queryInfo.otherName" />
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
    <div class="operationButton" style="margin-bottom:20px;">
      <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="addVisible" title="新增" @ok="addHandleOk" @cancel="addHandleCancel">
        <template slot="footer">
          <a-button key="submit" type="primary" :loading="addLoading" icon="plus-circle" @click="addHandleOk">
            保存
          </a-button>
          <a-button key="back" icon="close-circle" @click="addHandleCancel">
            取消
          </a-button>
        </template>
        <a-form-model ref="addRuleForm" :model="addForm" :rules="addRules" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-form-model-item has-feedback label="角色名称" prop="name">
            <a-input v-model="addForm.name" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="角色别名" prop="ortherName">
            <a-input v-model="addForm.ortherName" />
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
        </a-form-model>
      </a-modal>
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
    <div class="table">
      <a-table :loading="roleLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `每页10条，共 ${total} 条`}) }">
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
      <a-modal destroyOnClose v-model="viewVisible" title="查看" :footer="null">
        <p>角色名称： {{viewInfo.name}}</p>
        <p>角色别名： {{viewInfo.ortherName}}</p>
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
          <a-form-model-item has-feedback label="角色别名" prop="ortherName">
            <a-input v-model="editForm.ortherName" />
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
const columns = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '60px',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '角色别名',
    dataIndex: 'ortherName',
  },
  {
    title: '角色排序',
    dataIndex: 'sort',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '250px',
  },
]
const dataSource = []
for (let i = 0; i < 8; i++) {
  dataSource.push({
    key: i,
    name: '超级管理员',
    ortherName: 'administrator',
    sort: i + 2,
  })
}
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
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      queryInfo: {
        name: '',
        ortherName: '',
      },
      rules: {},
      search: true,
      dataSource,
      columns,
      roleLoading: false,
      selectedRowKeys: [],
      addVisible: false, // 新增对话框
      addLoading: false, // 保存新增
      addForm: {
        name: '',
        ortherName: '',
        superior: undefined,
        sort: null,
      },
      addRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        ortherName: [{ required: true, message: '请输入角色别名', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入角色排序', trigger: 'blur' }],
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
        ortherName: '',
        superior: undefined,
        sort: null,
      },
      editVisible: false, // 编辑对话框
      editForm: {
        name: '',
        ortherName: '',
        superior: undefined,
        sort: null,
      },
      editRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        ortherName: [{ required: true, message: '请输入角色别名', trigger: 'blur' }],
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
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert('1')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 勾选表单数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    add() {
      this.addVisible = true
    },
    addHandleOk() {
      this.addLoading = true
      this.$refs.addRuleForm.validate((valid) => {
        this.addLoading = false
        if (valid) {
          this.addVisible = false
          this.$message.success('新增成功')
          this.$refs.addRuleForm.resetFields()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addHandleCancel() {
      this.addVisible = false
      this.$refs.addRuleForm.resetFields()
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
    // 穿梭框
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
.role {
  background: #fff;
  // margin: 24px 16px;
  // margin-bottom: 24px;
  padding: 24px;
  // min-height: 280px;
  .table {
    a {
      font-size: 12px;
    }
  }
}
</style>