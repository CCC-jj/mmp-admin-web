<template>
  <div class="contentBox">
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
    <!-- 搜索栏 -->
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

    <!-- 操作按钮 -->
    <div class="operationButton" style="margin-bottom:20px;">
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-space>
            <a-button type="primary" icon="plus" @click="add">新增分类</a-button>
            <a-button type="danger" icon="delete">批量删除</a-button>
            <!-- <a-button icon="import">批量导入</a-button> -->
          </a-space>
        </a-col>

      </a-row>
    </div>

    <!-- 菜单表格 -->
    <div class="table">
      <a-table size="middle" :expandIconColumnIndex="2" :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="action" slot-scope="text,record">
          <a-space :size="15">
            <!-- <a @click="toView(record)">
              <a-icon type="eye" /> 查看
            </a> -->
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

    <a-modal :zIndex="1001" v-model="actionVisible" :title="actionTitle" @ok="checkHandleOk">
      <p>分类名称： {{actionInfo.name}}</p>
      <p>备注：
        <a-textarea v-model="actionInfo.remark" :rows="4" />
      </p>
      <p>是否显示：
        <a-radio-group v-model="actionInfo.result">
          <a-radio value="是">
            是
          </a-radio>
          <a-radio value="否">
            否
          </a-radio>
        </a-radio-group>
      </p>
    </a-modal>

  </div>
</template>

<script>
const columns = [
  // {
  //   title: '#',
  //   align: 'center',
  //   customRender: (text, record, index) => `${index + 1}`,
  //   width: '60px',
  // },
  {
    title: '分类名称',
    dataIndex: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '上传人',
    dataIndex: 'doPeople',
  },
  {
    title: '添加时间',
    dataIndex: 'joinTime',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '180px',
  },
]
const dataSource = []
for (let i = 0; i < 8; i++) {
  dataSource.push({
    key: i,
    name: '呼吸系统用药',
    status: '显示',
    remark: '备注内容',
    doPeople: 'admin',
    joinTime: '2020-02-07 21:00:00',
  })
}
export default {
  name: 'DrugSort',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        resName: '',
        room: undefined,
        job: undefined,
      },
      queryRules: {},
      // 表格
      tableLoading: false,
      columns,
      dataSource,
      selectedRowKeys: [],
      // 操作
      actionTitle: '新增医生',
      actionVisible: false,
      actionInfo: {
        name: '',
        remark: '',
        result: undefined,
      },
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
    // 新增医生
    add() {
      this.actionTitle = '新增分类'
      this.actionVisible = true
    },
    refresh() {
      this.reloadCard()
    },
    showSearch() {
      this.search = !this.search
    },
    // 表格
    // 勾选表单数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 编辑
    toEdit(record) {
      this.actionTitle = '分类编辑'
      this.actionInfo = record
      this.actionVisible = true
    },
    checkHandleOk() {
      this.actionVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.contentBox {
  .search {
    height: 65px;
  }
}
</style>