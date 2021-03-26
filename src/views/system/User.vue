<template>
  <div class="user">
    <div class="userLeft">
      <a-input-search style="margin-bottom: 8px" placeholder="输入关键字进行过滤" @change="onChange" />
      <a-tree :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :tree-data="gData" @expand="onExpand">
        <template slot="title" slot-scope="{ title }">
          <span v-if="title.indexOf(searchValue) > -1">
            {{ title.substr(0, title.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </div>

    <div class="userRight">
      <div class="search" v-show="search">
        <a-form-model ref="ruleForm" :model="queryInfo" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="登录账号" prop="name">
                <a-input placeholder="登录账号" v-model="queryInfo.name" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="用户姓名" prop="otherName">
                <a-input placeholder="用户姓名" v-model="queryInfo.otherName" />
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
        <!-- 新增 -->
        <a-drawer class="addDrawer" title="新增" width="50%" :maskClosable="false" :visible="addDrawerVisible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
          <a-form-model ref="addRuleForm" :model="addForm" :rules="addRules" v-bind="{labelCol: { span: 6 }, wrapperCol: { span: 18 }}">
            <a-collapse default-active-key="1" :bordered="false" expand-icon-position="right">
              <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
              </template>
              <a-collapse-panel key="1" :style="customStyle">
                <template slot="header">
                  <a-icon type="user" /> 基础信息
                </template>
                <a-row>
                  <a-col :span="24">
                    <a-form-model-item label="登录账号" prop="account" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
                      <a-input v-model="addForm.account" placeholder="请输入登录账号" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="密码" prop="password">
                      <a-input v-model="addForm.password" type="password" placeholder="请输入密码" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="确认密码" prop="checkPwd">
                      <a-input v-model="addForm.checkPwd" type="password" placeholder="请输入确认密码" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel key="2" :style="customStyle">
                <template slot="header">
                  <a-icon type="file-text" /> 详细信息
                </template>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户昵称" prop="nickName">
                      <a-input v-model="addForm.nickName" placeholder="请输入用户昵称" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="用户姓名" prop="name">
                      <a-input v-model="addForm.name" placeholder="请输入用户姓名" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="手机号码" prop="mobile">
                      <a-input v-model="addForm.mobile" placeholder="请输入手机号码" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="电子邮箱" prop="email">
                      <a-input v-model="addForm.email" placeholder="请输入电子邮箱" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户性别" prop="sex">
                      <a-input v-model="addForm.sex" placeholder="请选择用户性别" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="用户生日" prop="birth">
                      <a-input v-model="addForm.birth" placeholder="请选择用户生日" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
              <a-collapse-panel key="3" :style="customStyle">
                <template slot="header">
                  <a-icon type="team" /> 职责信息
                </template>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="用户编号" prop="number">
                      <a-input v-model="addForm.number" placeholder="请输入手机号码" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="所属角色" prop="role">
                      <a-input v-model="addForm.role" placeholder="请选择所属角色" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-model-item label="所属部门" prop="department">
                      <a-input v-model="addForm.department" placeholder="请选择所属部门" />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-model-item label="所属岗位" prop="post">
                      <a-input v-model="addForm.post" placeholder="请选择所属岗位" />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-form-model>
          <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
            <a-button icon="close-circle" :style="{ marginRight: '8px' }" @click="onClose">
              取消
            </a-button>
            <a-button icon="plus-circle" type="primary" @click="onClose">
              保存
            </a-button>
          </div>
        </a-drawer>
        <!-- 角色配置对话框 -->
        <a-modal width="400px" v-model="userRoleVisible" title="用户角色配置" @ok="userRoleHandleOk">
          <a-row>
            <a-col>
              <a-checkbox value="超级管理员">超级管理员</a-checkbox>
            </a-col>
            <a-col>
              <a-checkbox value="用户">用户</a-checkbox>
            </a-col>
            <a-col>
              <a-checkbox value="管理员">管理员</a-checkbox>
            </a-col>
            <a-col>
              <a-checkbox value="开发人员">开发人员</a-checkbox>
            </a-col>
          </a-row>
        </a-modal>

        <a-row type="flex" justify="space-between">
          <a-col>
            <a-space>
              <a-button type="primary" icon="plus" @click="add">新增</a-button>
              <a-button type="danger" icon="delete">删除</a-button>
              <a-button icon="user" @click="roleSetting">角色配置</a-button>
              <a-button icon="sync">密码重置</a-button>
              <a-button icon="upload">导出</a-button>
              <a-button icon="download">导入</a-button>
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
          <template slot="sort" slot-scope="text">
            <a-tag color="blue">
              {{text}}
            </a-tag>
          </template>
          <template slot="department" slot-scope="text">
            <a-tag color="blue">
              {{text}}
            </a-tag>
          </template>
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
    </div>
  </div>
</template>

<script>
const gData = [
  {
    key: '公司1',
    title: '公司1',
    scopedSlots: { title: 'title' },
    children: [
      {
        key: '部门11',
        title: '部门11',
        scopedSlots: { title: 'title' },
        children: [
          {
            key: '部门111',
            title: '部门111',
            scopedSlots: { title: 'title' },
          },
          {
            key: '部门112',
            title: '部门112',
            scopedSlots: { title: 'title' },
          },
        ],
      },
      {
        key: '部门12',
        title: '部门12',
        scopedSlots: { title: 'title' },
        children: [
          {
            key: '部门121',
            title: '部门121',
            scopedSlots: { title: 'title' },
          },
          {
            key: '部门122',
            title: '部门122',
            scopedSlots: { title: 'title' },
          },
        ],
      },
    ],
  },
  {
    key: '公司2',
    title: '公司2',
    scopedSlots: { title: 'title' },
    children: [
      {
        key: '部门21',
        title: '部门21',
        scopedSlots: { title: 'title' },
        children: [
          {
            key: '部门221',
            title: '部门221',
            scopedSlots: { title: 'title' },
          },
          {
            key: '部门212',
            title: '部门212',
            scopedSlots: { title: 'title' },
          },
        ],
      },
      {
        key: '部门22',
        title: '部门22',
        scopedSlots: { title: 'title' },
        children: [
          {
            key: '部门221',
            title: '部门221',
            scopedSlots: { title: 'title' },
          },
          {
            key: '部门222',
            title: '部门222',
            scopedSlots: { title: 'title' },
          },
        ],
      },
    ],
  },
  {
    key: '公司3',
    title: '公司3',
    scopedSlots: { title: 'title' },
  },
]

const dataList = []
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: key })
    if (node.children) {
      generateList(node.children)
    }
  }
}
generateList(gData)

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

const columns = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '60px',
  },
  {
    title: '登录账户',
    dataIndex: 'name',
  },
  {
    title: '用户姓名',
    dataIndex: 'ortherName',
  },
  {
    title: '所属角色',
    dataIndex: 'sort',
    scopedSlots: { customRender: 'sort' },
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    scopedSlots: { customRender: 'department' },
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
    department: 'Fizz-Gateway公司,部门1,部门4',
  })
}
export default {
  name: 'User',
  inject: ['reloadCard'],
  data() {
    // 表单验证
    let validatePass = (rule, value, callback) => {
      const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
      if (value === '' || value.length < 6) {
        callback(new Error('密码需在六位数及以上'))
      } else if (!reg.test(value)) {
        callback(new Error('密码必须包含数字和字母'))
      } else {
        if (this.addForm.checkPwd !== '') {
          this.$refs.addRuleForm.validateField('checkPwd')
        }
        callback()
      }
    }
    let validatecheckPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.addForm.password) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      // 树状控件
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData,
      // 搜索栏
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      queryInfo: {
        name: '',
        ortherName: '',
      },
      rules: {},
      search: true,
      // 新增
      addDrawerVisible: false,
      addForm: {
        account: '',
        password: '',
        checkPwd: '',
        nickName: '',
        name: '',
        mobile: '',
        email: '',
        sex: '',
        birth: '',
        number: '',
        role: '',
        department: '',
        post: '',
      },
      addRules: {
        account: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'change' }],
        checkPwd: [{ required: true, validator: validatecheckPwd, trigger: 'change' }],
        nickName: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        role: [{ required: true, message: '请选择所属角色', trigger: 'change' }],
        department: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
        post: [{ required: true, message: '请选择所属岗位', trigger: 'change' }],
      },
      customStyle:
        'background: #fff;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
      // 用户角色配置
      userRoleVisible: false,
      // 表格
      dataSource,
      columns,
      roleLoading: false,
      selectedRowKeys: [],
      drawerVisible: false, // 列显隐
      // 穿梭框
      mockData: [
        {
          key: '1',
          title: '登录账户',
          description: 'description of 登录账户',
        },
        {
          key: '2',
          title: '用户姓名',
          description: 'description of 用户姓名',
        },
        {
          key: '3',
          title: '所属角色',
          description: 'description of 所属角色',
        },
        {
          key: '4',
          title: '所属部门',
          description: 'description of 所属部门',
        },
      ],
      targetKeys: ['1', '2', '3', '4'],
    }
  },
  methods: {
    // 树状控件
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange(e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      })
    },
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
    // 新增
    add() {
      this.addDrawerVisible = true
    },
    onClose() {
      this.addDrawerVisible = false
    },
    // 角色配置
    roleSetting() {
      this.userRoleVisible = true
    },
    userRoleHandleOk() {
      this.userRoleVisible = false
    },
    // 勾选表格数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
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
      console.log(record)
      // this.viewInfo = record
      // this.viewVisible = true
    },
    // 编辑
    toEdit(record) {
      console.log(record)
      // this.editForm = record
      // this.editVisible = true
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
.user {
  display: flex;
  justify-content: space-between;
  .userLeft {
    width: 20%;
    background: #fff;
    padding: 24px;
    min-height: 280px;
  }
  .userRight {
    width: 79%;
    background: #fff;
    padding: 24px;
    min-height: 280px;
    .table {
      a {
        font-size: 12px;
      }
    }
  }
}
.addDrawer /deep/ .ant-collapse {
  background-color: #ffffff;
}
.addDrawer /deep/ .ant-collapse-item{
  margin-bottom: 0 !important;
}
.addDrawer /deep/ .ant-collapse-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
  font-size: 16px;
}
// .addDrawer /deep/ .ant-collapse-content-box{
//   // padding: 24px 16px !important;
// }
</style>