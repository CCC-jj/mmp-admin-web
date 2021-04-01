<template>
  <div class="Details">
    <div class="cardHeader">
      <span class="title">[{{detailsTitle}}]字典详情</span>
    </div>
    <div class="cardBody">
      <!-- 搜索栏 -->
      <transition name="mask">
        <div class="search" v-show="searchDetails">
          <a-form-model ref="queryDetailsRuleForm" :model="queryInfoDetails" :rules="queryRulesDetails" :label-col="{span: 6}" :wrapper-col="{span: 18}">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-model-item label="字典编号" prop="no">
                  <a-input placeholder="字典编号" v-model="queryInfoDetails.no" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="字典名称" prop="name">
                  <a-input placeholder="字典名称" v-model="queryInfoDetails.name" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row type="flex" justify="end">
              <a-col :span="12">
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
          </a-form-model>
        </div>
      </transition>
      <!-- 操作按钮 -->
      <div class="operationButton" style="margin-bottom:16px;">
        <!-- 新增对话框 -->
        <a-modal destroyOnClose :maskClosable="false" width="800px" v-model="addDetailsVisible" :title="actionTitle" @ok="addDetailsHandleOk" @cancel="addDetailsHandleCancel">
          <template slot="footer">
            <a-button key="submit" type="primary" :loading="addDetailsLoading" icon="plus-circle" @click="addDetailsHandleOk">
              保存
            </a-button>
            <a-button key="back" icon="close-circle" @click="addDetailsHandleCancel">
              取消
            </a-button>
          </template>
          <a-form-model ref="addRuleForm" :model="addDictDetailsForm" :rules="addDictDetailsRules" :label-col="{span:6}" :wrapper-col="{span:18}">
            <a-row>
              <a-col :span="24">
                <a-form-model-item :labelCol="{span: 3}" :wrapperCol="{span: 21}" has-feedback label="字典编号" prop="no">
                  <a-input v-model="addDictDetailsForm.no" placeholder="请输入字典编号" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item has-feedback label="字典名称" prop="name">
                  <a-input v-model="addDictDetailsForm.name" placeholder="请输入字典名称" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item has-feedback label="字典排序" prop="sort">
                  <a-input-number v-model="addDictDetailsForm.sort" style="width: 100%;" placeholder="请输入字典排序" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="封存" prop="archive">
                  <a-switch v-model="addDictDetailsForm.archive" checked-children="是" un-checked-children="否" />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item has-feedback label="字典备注" prop="remark">
                  <a-input v-model="addDictDetailsForm.remark" placeholder="请输入字典备注" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-modal>
        <a-row type="flex" justify="space-between">
          <a-col>
            <a-space>
              <a-button type="primary" icon="plus" @click="addDictDetails">新增</a-button>
              <a-button type="danger" icon="delete">删除</a-button>
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
      <a-table :scroll="{ x: 600 }" :loading="listLoading" bordered :data-source="dataSourceList" :columns="columnsList" :row-selection="{selectedRowKeys: selectedRowKeysList, onChange: onSelectChangeList}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="archive" slot-scope="text">
          <a-tag color="blue">
            {{text ? '是' : '否'}}
          </a-tag>
        </template>
        <template slot="action" slot-scope="text,record">
          <a-space :size="15" @mousedown="e => e.preventDefault()">
            <a @click="toEdit(record)" style="font-size:12px;">
              <a-icon type="edit" /> 编辑
            </a>
            <a-popconfirm title="确定删除吗?" @confirm="() => onDelete(record.key)">
              <a href="javascript:;" style="font-size:12px;">
                <a-icon type="delete" /> 删除
              </a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
const columnsList = [
  {
    title: '#',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
    width: '30px',
    fixed: 'left',
  },
  {
    title: '字典编号',
    dataIndex: 'no',
  },
  {
    title: '字典名称',
    dataIndex: 'name',
  },
  // {
  //   title: '字典排序',
  //   dataIndex: 'sort',
  // },
  {
    title: '封存',
    dataIndex: 'archive',
    scopedSlots: { customRender: 'archive' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '150px',
    fixed: 'right',
  },
]
const dataSourceList = []
for (let i = 0; i < 3; i++) {
  dataSourceList.push({
    key: i,
    no: 'sex',
    name: '男',
    sort: i,
    archive: false,
  })
}
export default {
  name: 'DictDetails',
  inject: ['reloadDetails'],
  props: {
    detailsTitle: {
      type: String,
    },
  },
  data() {
    return {
      searchDetails: true,
      queryInfoDetails: {
        no: '',
        name: '',
      },
      queryRulesDetails: {},
      // 新增字典详情
      actionTitle: '新增',
      addDetailsVisible: false,
      addDetailsLoading: false,
      addDictDetailsForm: {
        no: '',
        name: '',
        sort: '',
        archive: false,
        remark: '',
      },
      addDictDetailsRules: {
        no: [{ required: true, message: '请输入字典编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入字典排序', trigger: 'blur' }],
        archive: [{ required: true, message: '请选择是否封存', trigger: 'change' }],
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
      columnsList,
      dataSourceList,
      listLoading: false,
      selectedRowKeysList: [],
    }
  },
  methods: {
    // 提交搜索
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('1')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置搜索框
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增字典列表
    addDictDetails() {
      this.addDetailsVisible = true
    },
    addDetailsHandleOk() {
      this.addDetailsVisible = false
      this.addDictDetailsForm = this.$options.data().addDictDetailsForm
    },
    addDetailsHandleCancel() {
      this.addDetailsVisible = false
      this.addDictDetailsForm = this.$options.data().addDictDetailsForm
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
    onSelectChangeList(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeysList = selectedRowKeys
    },
    // 编辑
    toEdit(record) {
      console.log(record)
      this.addDetailsVisible = true
      this.actionTitle = '编辑'
      this.addDictDetailsForm = record
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