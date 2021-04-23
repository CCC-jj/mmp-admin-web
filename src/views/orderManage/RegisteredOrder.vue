<template>
  <div class="RegisteredOrder">
    <!-- 搜索栏 -->
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
    <transition name="mask">
      <div class="search" v-show="search">
        <a-form-model ref="queryRuleForm" :model="queryInfo" :rules="queryRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" @keyup.enter.native="onSubmit">
          <a-row>
            <a-col :span="6">
              <a-form-model-item label="名称" prop="resName">
                <a-input placeholder="输入患者名称或手机号" v-model="queryInfo.resName" />
              </a-form-model-item>
            </a-col>
            
            <a-col :span="6">
              <a-form-model-item label="日期" prop="data">
                <a-range-picker v-model="queryInfo.data" />
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

    <div class="operationButton" style="margin-bottom:20px;">
      <a-row type="flex" justify="space-between">
        <a-col>

        </a-col>
        
      </a-row>
    </div>

    <!-- 切换标签 -->
    <div class="tabs">
      <a-tabs default-active-key="1" @change="changeTabs">
        <a-tab-pane key="1" tab="全部">
        </a-tab-pane>
        <a-tab-pane key="2" tab="待支付">
        </a-tab-pane>
        <!-- <a-tab-pane key="3" tab="进行中">
        </a-tab-pane> -->
        <a-tab-pane key="4" tab="已完成">
        </a-tab-pane>
        <a-tab-pane key="5" tab="已取消">
        </a-tab-pane>
        <a-tab-pane key="6" tab="已退款">
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 医生操作抽屉 -->
    <a-drawer width="50%" :title="actionTitle" :visible="actionVisible" :after-visible-change="afterActionVisibleChange" @close="actionOnClose">
      <div class="actionBox">
        <div class="title">挂号信息</div>
        <a-row type="flex" justify="space-between">
          <div style="flex:2">
            <!-- <img style="margin:0 auto;width:100%;margin:35px 0;" src="../../assets/u2133.png" alt=""> -->
          </div>
          <div style="flex:8">

          </div>
        </a-row>

      </div>
      <div class="actionBox">
        <div class="title">订单信息</div>
      </div>
    </a-drawer>

    <!-- 菜单表格 -->
    <div class="table">
      <a-table size="middle" :expandIconColumnIndex="2" :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="action" slot-scope="text,record">
          <a-space :size="15">
            <a @click="toView(record)">
              <a-icon type="eye" /> 查看订单
            </a>
            <!-- <a @click="toEdit(record)">
              <a-icon type="edit" /> 查看粉丝
            </a> -->
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
    title: '订单编号',
    dataIndex: 'no',
  },
  {
    title: '提交时间',
    dataIndex: 'time',
  },
  {
    title: '用户名',
    dataIndex: 'name',
  },
  {
    title: '医生',
    dataIndex: 'doctor',
  },
  {
    title: '科室',
    dataIndex: 'room',
  },
  // {
  //   title: '方式',
  //   dataIndex: 'type',
  // },
  // {
  //   title: '来源',
  //   dataIndex: 'from',
  // },
  {
    title: '挂号费',
    dataIndex: 'cost',
  },
  {
    title: '订单状态',
    dataIndex: 'status',
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
		no: '20200207',
    name: '田田',
    time: '2020-02-07 21:00:00',
    room: '内科',
    doctor: '张三',
    // type: '视频问诊',
    // from: '视频问诊',
    cost: '20',
    status: '待支付',
  })
}
export default {
  name: 'RegisteredOrder',
  inject: ['reloadCard'],
  data() {
    return {
      // 搜索栏
      search: true,
      queryInfo: {
        resName: '',
        status: undefined,
        type: undefined,
        from: undefined,
        data: null,
      },
      queryRules: {},
      // 表格
      tableLoading: false,
      columns,
      dataSource,
      selectedRowKeys: [],
      // 操作医生
      actionTitle: '新增医生',
      actionVisible: false,
      // 查看医生详情
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
    // 刷新
    refresh() {
      this.reloadCard()
    },
    // 搜索栏
    showSearch() {
      this.search = !this.search
    },
    changeTabs(key) {
      console.log(key)
    },
    // 表格
    // 勾选表单数据
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 操作抽屉
    afterActionVisibleChange(val) {
      console.log('visible', val)
    },
    actionOnClose() {
      this.actionVisible = false
    },
    // 查看医生详情
    toView(record) {
      console.log(record)
      this.actionTitle = '订单详情'
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
.RegisteredOrder {
  background: #fff;
  padding: 24px;
  .search {
    height: 65px;
    overflow: hidden;
  }
}
.actionBox {
  border: 1px solid #eee;
  margin-bottom: 10px;
  // padding: 5px;
  .title {
    font-size: 16px;
    background: rgb(250, 250, 250);
    padding: 10px;
  }
}
</style>