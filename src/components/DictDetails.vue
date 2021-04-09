<template>
  <div class="Details">
    <div class="cardHeader">
      <span class="title">[{{title}}]字典详情</span>
    </div>
    <div class="cardBody">
      <!-- 搜索栏 -->
      <transition name="mask">
        <div class="search" v-show="searchDetails">
          <a-form-model ref="queryDetailsRuleForm" :model="queryInfoDetails" :rules="queryRulesDetails" :label-col="{span: 6}" :wrapper-col="{span: 18}">
            <a-row :gutter="16">
              <!-- <a-col :span="12">
                <a-form-model-item label="字典编号" prop="dictType">
                  <a-input placeholder="字典编号" v-model="queryInfoDetails.dictType" />
                </a-form-model-item>
              </a-col> -->
              <a-col :span="12">
                <a-form-model-item label="字典值名称" prop="childName">
                  <a-input placeholder="字典值名称" v-model="queryInfoDetails.childName" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-row type="flex" justify="end">
                  <a-col :span="24">
                    <a-form-model-item :wrapper-col="{ span: 24 }" style="float:right;">
                      <a-button style="margin-right:10px;" type="primary" icon="search" @click="onSubmit('queryDetailsRuleForm')">
                        搜索
                      </a-button>
                      <a-button icon="delete" @click="resetForm('queryDetailsRuleForm')">
                        清空
                      </a-button>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </transition>
      <!-- 操作按钮 -->
      <div class="operationButton" style="margin-bottom:16px;">
        <!-- 新增对话框 -->
        <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="actionDetailsVisible" :title="actionTitle" @ok="actionDetailsHandleOk" @cancel="actionDetailsHandleCancel" :afterClose="actionAfterClose">
          <template slot="footer">
            <a-button key="submit" type="primary" :loading="actionDetailsLoading" icon="plus-circle" @click="actionDetailsHandleOk">
              保存
            </a-button>
            <a-button key="back" icon="close-circle" @click="actionDetailsHandleCancel">
              取消
            </a-button>
          </template>
          <a-form-model ref="addRuleForm" :model="actionDictDetailsForm" :rules="addDictDetailsRules" :label-col="{span:6}" :wrapper-col="{span:18}">
            <a-row>
              <a-col :span="12">
                <a-form-model-item :labelCol="{span: 3}" :wrapperCol="{span: 21}" has-feedback label="字典值编号" prop="dictType">
                  <a-input v-model="actionDictDetailsForm.dictType" placeholder="请输入字典值编号" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item has-feedback label="字典值" prop="childValue">
                  <a-input v-model="actionDictDetailsForm.childValue" placeholder="请输入字典值" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item has-feedback label="字典值名称" prop="childName">
                  <a-input v-model="actionDictDetailsForm.childName" placeholder="请输入字典值名称" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item has-feedback label="字典值排序" prop="childSort">
                  <a-input-number v-model="actionDictDetailsForm.childSort" style="width: 100%;" placeholder="请输入字典值排序" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="字典值状态" prop="childStatus">
                  <a-switch :checked="actionDictDetailsForm.childStatus===1?true:false" checked-children="启用" un-checked-children="禁用" @change="changeDictStatus" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item has-feedback label="是否默认" prop="childDefault">
                  <a-switch v-model="actionDictDetailsForm.childDefault" checked-children="是" un-checked-children="否" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-modal>
        <a-row type="flex" justify="space-between">
          <a-col>
            <a-space>
              <a-button type="primary" icon="plus" @click="addDictDetails">新增</a-button>
              <!-- <a-button type="danger" icon="delete">删除</a-button> -->
            </a-space>
          </a-col>
          <a-drawer width="50%" title="列显隐" placement="right" :visible="drawerVisible" @close="drawerOnClose">
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
                <a-button shape="circle" icon="search" @click="showSearch('searchDetails')" />
              </a-tooltip>
            </a-space>
          </a-col>
        </a-row>
      </div>
      <!-- 字典表格 -->
      <a-table :scroll="{ x: 900 }" :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.childValue}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="childDefault" slot-scope="text">
          <span v-if="text">是</span>
          <span v-else>否</span>
        </template>
        <template slot="childStatus" slot-scope="text">
          <span v-if="text===1">启用</span>
          <span v-else>禁用</span>
        </template>
        <template slot="action" slot-scope="text,record">
          <a-space :size="15" @mousedown="e => e.preventDefault()">
            <a @click="toEdit(record)" style="font-size:12px;">
              <a-icon type="edit" /> 编辑
            </a>
            <!-- <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.childValue)">
              <a href="javascript:;" style="font-size:12px;">
                <a-icon type="delete" /> 删除
              </a>
            </a-popconfirm> -->
          </a-space>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getDictDetail, addDictDetail, editDictDetail } from '@/api/system/dict'
const columns = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '50px',
    fixed: 'left',
  },
  {
    title: '字典值编号',
    dataIndex: 'dictType',
  },
  {
    title: '字典值名称',
    dataIndex: 'childName',
  },
  {
    title: '字典值',
    dataIndex: 'childValue',
  },
  {
    title: '字典值排序',
    dataIndex: 'childSort',
  },
  {
    title: '字典值状态',
    dataIndex: 'childStatus',
    scopedSlots: { customRender: 'childStatus' },
  },
  {
    title: '是否默认',
    dataIndex: 'childDefault',
    scopedSlots: { customRender: 'childDefault' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '100px',
    fixed: 'right',
  },
]
const dataSource = []
// for (let i = 0; i < 3; i++) {
//   dataSource.push({
//     key: i,
//     no: 'sex',
//     name: '男',
//     sort: i,
//     archive: false,
//   })
// }
export default {
  name: 'DictDetails',
  inject: ['reloadDetails'],
  props: {
    detailsTitle: {
      type: String,
    },
    dictType: {
      type: String,
    },
  },
  data() {
    return {
      title: '暂无',
      searchDetails: true,
      queryInfoDetails: {
        childName: '',
        dictType: '',
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
      },
      queryRulesDetails: {},
      // 新增字典详情
      actionTitle: '新增',
      actionDetailsVisible: false,
      actionDetailsLoading: false,
      actionDictDetailsForm: {
        dictType: '',
        childName: '',
        childSort: '',
        childValue: '',
        childStatus: false,
        childDefault: false,
      },
      addDictDetailsRules: {
        dictType: [{ required: true, message: '请输入字典编号', trigger: 'blur' }],
        childName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        childSort: [{ required: true, message: '请输入字典排序', trigger: 'blur' }],
        childValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
        childStatus: [{ required: true, message: '请选择是否封存', trigger: 'change' }],
      },
      // 列显隐
      drawerVisible: false,
      mockData: [
        {
          key: '1',
          title: '字典排序',
          description: 'description of 字典排序',
        },
        {
          key: '2',
          title: '字典备注',
          description: 'description of 字典备注',
        },
        {
          key: '3',
          title: '字典编号',
          description: 'description of 字典编号',
        },
        {
          key: '4',
          title: '字典名称',
          description: 'description of 字典名称',
        },
        {
          key: '5',
          title: '封存',
          description: 'description of 封存',
        },
      ],
      targetKeys: ['1', '2', '3'],
      // 字典表格
      columns,
      dataSource,
      tableLoading: false,
      selectedRowKeys: [],
    }
  },
  watch: {
    detailsTitle(val, oldVal) {
      console.log(val, oldVal)
      this.title = val
    },
    dictType(val, oldVal) {
      console.log(val, oldVal)
      this.queryInfoDetails.dictType = val
      this.getTableList()
    },
  },
  methods: {
    getTableList() {
      this.tableLoading = true
      getDictDetail(this.queryInfoDetails)
        .then((res) => {
          console.log(res)
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
    // 提交搜索
    onSubmit(formName) {
      console.log(formName)
      this.queryInfoDetails.page = 1
      this.getTableList()
    },
    // 重置搜索框
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增字典列表
    addDictDetails() {
      if (!this.queryInfoDetails.dictType) {
        this.$message.info('请先选择字典类型')
      } else {
        this.actionDetailsVisible = true
      }
    },
    actionDetailsHandleOk() {
      if (this.actionTitle === '新增') {
        addDictDetail(this.actionDictDetailsForm)
          .then((res) => {
            if (res.success) {
              this.$message.success('新增成功')
              this.actionDetailsVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        editDictDetail(this.actionDictDetailsForm)
          .then((res) => {
            if (res.success) {
              this.$message.success('编辑成功')
              this.actionDetailsVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    actionDetailsHandleCancel() {
      this.actionDetailsVisible = false
    },
    // 对话框关闭
    actionAfterClose() {
      this.isEdit = false
      this.actionDictDetailsForm = this.$options.data().actionDictDetailsForm
    },
    // 改变字典值状态
    changeDictStatus(checked) {
      this.actionDictDetailsForm.childStatus = checked ? 1 : 2
    },
    // 刷新此页面
    refresh() {
      this.reloadDetails()
    },
    // 打开列显隐
    showDrawer() {
      this.drawerVisible = true
    },
    // 关闭列显隐抽屉
    drawerOnClose() {
      this.drawerVisible = false
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
    // 搜索栏显示与隐藏
    showSearch(searchName) {
      this[searchName] = !this[searchName]
    },
    // 勾选表格数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 编辑
    toEdit(record) {
      console.log(record)
      this.actionDetailsVisible = true
      this.actionTitle = '编辑'
      this.actionDictDetailsForm = record
    },
    // 删除
    onDelete(key) {
      console.log(key)
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
    height: 130px;
  }
}
.mask-enter-active {
  animation: mask-in 0.2s linear;
}
.mask-leave-active {
  animation: mask-in 0.2s reverse linear;
}
.cardHeader {
  border-bottom: 1px solid #eee;
  padding: 6px 18px;
  .title {
    font-size: 18px;
  }
}
.cardBody {
  padding: 16px;
  .search {
    height: 130px;
    overflow: hidden;
  }
}
</style>