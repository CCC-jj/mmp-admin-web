<template>
  <div class="client">
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
        <a-form-model ref="queryRuleForm" :model="queryInfo" :rules="queryRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" @keyup.enter.native="onSubmit">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="客户端名称" prop="searchKey">
                <a-input placeholder="客户端名称" v-model="queryInfo.searchKey" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="客户端状态" prop="clientStatus">
                <a-select v-model="queryInfo.clientStatus" placeholder="客户端状态">
                  <a-select-option :value="0">
                    全部
                  </a-select-option>
                  <a-select-option :value="1">
                    启用
                  </a-select-option>
                  <a-select-option :value="2">
                    禁用
                  </a-select-option>
                </a-select>
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
      <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="actionVisible" :title="actionTitle" @cancel="actionHandleCancel" :afterClose="afterClose">
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
          <a-form-model-item has-feedback label="客户端代码" prop="clientId">
            <a-input :disabled="viewVisible" v-model="actionForm.clientId" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="客户端名称" prop="clientName">
            <a-input :disabled="viewVisible" v-model="actionForm.clientName" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="客户端密钥" prop="clientSecret">
            <a-input :disabled="viewVisible" v-model="actionForm.clientSecret" />
          </a-form-model-item>
          <a-form-model-item v-if="actionTitle!=='新增'" has-feedback label="客户端状态" prop="clientStatus">
            <a-switch :disabled="viewVisible" checked-children="启用" un-checked-children="禁用" :checked="actionForm.clientStatus===1?true:false" @change="onChangeClientStatus" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="备注" prop="remark">
            <a-input :disabled="viewVisible" v-model="actionForm.remark" />
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
        
      </a-row>
    </div>

    <!-- 表格数据 -->
    <a-table :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.clientId}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: queryInfo.limit, total: total, current: queryInfo.page, showTotal: ((total) => {return `共 ${total} 条`}) }" @change="tableChange">
      <template slot="clientStatus" slot-scope="text">
        <span v-if="text===1">正常</span>
        <span v-else-if="text===2">禁用</span>
        <span v-else>已删除</span>
      </template>
      <template slot="action" slot-scope="text,record">
        <a-space :size="15">
          <a @click="toView(record)">
            <a-icon type="eye" /> 查看
          </a>
          <a @click="toEdit(record)">
            <a-icon type="edit" /> 编辑
          </a>
          <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.clientId)">
            <a href="javascript:;">
              <a-icon type="delete" /> 删除
            </a>
          </a-popconfirm>
          <a @click="toUser(record)">
            <a-icon type="edit" /> 用户授权
          </a>
        </a-space>
      </template>
    </a-table>
    <a-drawer width="50%" title="用户授权" placement="right" :visible="userVisible" :after-visible-change="userafterVisibleChange" @close="userdrawerOnClose">
      <div style="margin:0 auto;">
        <a-transfer :listStyle="{width:'40%',height:'500px'}" :titles="['未授权','已授权']" :operations="['授权', '取消']" :data-source="userTreeData.user" show-search :filter-option="transferFilterOption" :target-keys="userTargetKeys" :render="record => record.title" @change="usertransferHandleChange" @search="usertransferHandleSearch" />
      </div>
    </a-drawer>
    <!-- <a-modal destroyOnClose width="300px" v-model="userVisible" title="用户授权" @ok="userHandleOk" @cancel="userHandleCancel" :afterClose="userAfterClose">
      <a-row v-for="(item, index) in userTreeData.user" :key="index">
        <a-col :span="24" style="margin-bottom:10px;">
          <a-checkbox :checked="item.forAuth" :value="item.userId" @change="(e)=>useronChange(e,item)">
            {{item.userName}}
          </a-checkbox>
        </a-col>
      </a-row>
    </a-modal> -->
  </div>
</template>

<script>
import {
  getClientList,
  createClient,
  modifyClient,
  disableClient,
  userClient,
  enableAccredit,
} from '@/api/system/client'
const columns = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '60px',
  },
  {
    title: '客户端代码',
    dataIndex: 'clientId',
  },
  {
    title: '客户端名称',
    dataIndex: 'clientName',
  },
  {
    title: '客户端密钥',
    dataIndex: 'clientSecret',
  },
  {
    title: '客户端状态',
    dataIndex: 'clientStatus',
    scopedSlots: { customRender: 'clientStatus' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '300px',
  },
]
// const dataSource = []
// for (let i = 0; i < 5; i++) {
//   dataSource.push({
//     key: i,
//     clientId: '1',
//     clientName: 'clientName',
//     clientSecret: 'clientSecret',
//     clientStatus: 0,
//   })
// }
export default {
  name: 'Client',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        clientStatus: 0,
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        searchKey: '',
      },
      queryRules: {},
      // 新增对话框
      actionTitle: '',
      actionVisible: false,
      actionLoading: false,
      actionForm: {
        clientId: '',
        clientName: '',
        clientSecret: '',
        clientStatus: 0,
        remark: '',
      },
      actionRules: {
        clientId: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        clientName: [{ required: true, message: '请输入参数键名', trigger: 'blur' }],
        clientSecret: [{ required: true, message: '请输入参数键值', trigger: 'blur' }],
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
      dataSource: [],
      columns,
      tableLoading: false, //加载中
      selectedRowKeys: [],
      total: 0,
      // 查看
      viewVisible: false,
      // 用户授权
      userVisible: false,
      userTreeData: {},
      userTargetKeys: [],
      enableList: [],
      // replaceFields: {
      //   title: 'userName',
      //   key: 'userId',
      //   selectable: 'auth',
      // },
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    // 获取表格数据
    getTableList() {
      this.tableLoading = true
      getClientList(this.queryInfo)
        .then((res) => {
          this.dataSource = res.data
          if (res.success) {
            this.total = res.count
          } else {
            this.$message.warning(res.message)
          }
          this.tableLoading = false
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 搜索栏
    onSubmit() {
      this.queryInfo.page = 1
      this.getTableList()
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
      this.$refs.actionRuleForm.validate((valid) => {
        if (valid) {
          this.actionLoading = true
          if (this.actionTitle === '新增') {
            createClient(this.actionForm)
              .then((res) => {
                if (res.success) {
                  this.actionVisible = false
                  this.$message.success('新增成功')
                  this.getTableList()
                } else {
                  this.$message.warning(res.message)
                }
                this.actionLoading = false
              })
              .catch((err) => {
                console.error(err)
              })
          } else if (this.actionTitle === '编辑') {
            modifyClient(this.actionForm)
              .then((res) => {
                if (res.success) {
                  this.actionVisible = false
                  this.$message.success('修改成功')
                  this.getTableList()
                } else {
                  this.$message.warning(res.message)
                }
                this.actionLoading = false
              })
              .catch((err) => {
                console.error(err)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    // 翻页等表格操作
    tableChange(pagination) {
      this.queryInfo.page = pagination.current
      this.queryInfo.limit = pagination.pageSize
      this.getTableList()
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
    onChangeClientStatus(checked) {
      disableClient(this.actionForm.clientId)
        .then((res) => {
          if (res.success) {
            this.actionForm.clientStatus = checked ? 1 : 2
          }
          this.$message.success(res.message)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 删除
    onDelete(key) {
      const data = [...this.dataSource]
      this.dataSource = data.filter((item) => item.clientId !== key)
      this.$message.success('删除成功！')
    },
    // 用户授权
    toUser(record) {
      this.userVisible = true
      let targetKeys = []
      userClient(record.clientId)
        .then((res) => {
          if (res.success) {
            this.userTreeData = res.data
            this.userTreeData.user = res.data.user.map((item) => {
              return {
                key: item.userId,
                title: item.userName,
                account: item.account,
                forAuth: item.forAuth,
                description: item.userName,
              }
            })
            res.data.user.forEach((item) => {
              if (item.forAuth) {
                targetKeys.push(item.key)
              }
            })
            this.userTargetKeys = targetKeys
            console.log(this.userTargetKeys, res.data.user)
            console.log(this.userTreeData)
          } else {
            this.$message.warning(res.message)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // userHandleOk() {
    //   this.userVisible = false
    // },
    userdrawerOnClose() {
      this.userVisible = false
    },
    userafterVisibleChange(val) {
      console.log('visible', val)
    },
    // 用户授权穿梭框
    usertransferHandleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys)

      let list = targetKeys.map((item) => {
        return {
          clientId: this.userTreeData.clientId,
          userId: item,
        }
      })
      console.log(list, targetKeys)
      enableAccredit(list)
        .then((res) => {
          console.log(res)
          if (res.success) {
            this.userTargetKeys = targetKeys
          }
          this.$message.info(res.message)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    usertransferHandleSearch(dir, value) {
      console.log('search:', dir, value)
    },
    // userAfterClose() {},
    // useronSelect(selectedKeys, info) {
    //   console.log('selected', selectedKeys, info)
    // },
    // useronCheck(checkedKeys, info) {
    //   console.log('onCheck', checkedKeys, info)
    // },
    useronChange(e, item) {
      const checked = e.target.checked
      // const value = e.target.value
      item.forAuth = checked
      // enableAccredit([{ clientId: this.userTreeData.clientId, userId: value }])
      //   .then((res) => {
      //     if (res.success) {
      //       item.forAuth = checked
      //     } else {
      //       item.forAuth = !checked
      //     }
      //     this.$message.info(res.message)
      //   })
      //   .catch((err) => {
      //     console.error(err)
      //   })
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
.client {
  background: #fff;
  padding: 24px;
  min-height: 280px;
  .search {
    height: 65px;
    overflow: hidden;
  }
}
// .ant-btn-icon-only.ant-btn-sm{
//   width: 75px !important;
// }
</style>