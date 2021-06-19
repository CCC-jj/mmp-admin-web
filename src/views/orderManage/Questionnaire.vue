<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <template v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="名称">
                  <a-input v-model="queryParam.resName" placeholder="输入患者名称或手机号" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="问诊状态">
                  <a-select v-model="queryParam.status" placeholder="请选择问诊状态">
                    <a-select-option value="待支付">
                      待支付
                    </a-select-option>
                    <a-select-option value="待接诊">
                      待接诊
                    </a-select-option>
                    <a-select-option value="已完成">
                      已完成
                    </a-select-option>
                    <a-select-option value="咨询中">
                      咨询中
                    </a-select-option>
                    <a-select-option value="已取消">
                      已取消
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="问诊方式">
                  <a-select v-model="queryParam.type" placeholder="请选择问诊方式">
                    <a-select-option value="图文咨询">
                      图文咨询
                    </a-select-option>
                    <a-select-option value="电话咨询">
                      电话咨询
                    </a-select-option>
                    <a-select-option value="视频咨询">
                      视频咨询
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="问诊来源">
                  <a-select v-model="queryParam.type" placeholder="请选择问诊来源">
                    <a-select-option value="图文咨询">
                      图文咨询
                    </a-select-option>
                    <a-select-option value="电话咨询">
                      电话咨询
                    </a-select-option>
                    <a-select-option value="视频咨询">
                      视频咨询
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="日期">
                  <a-range-picker v-model="queryParam.data" />
                </a-form-item>
              </a-col>

            </template>
            <a-col :md="advanced && 6 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
                <template v-if="advanced">
                  <a-button v-action:query type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                </template>

                <a-space style="margin-left: 20px">
                  <a-tooltip title="刷新">
                    <a-button shape="circle" icon="reload" @click="reloadCard()" />
                  </a-tooltip>
                  <a-tooltip title="搜索">
                    <a-button shape="circle" icon="search" @click="toggleAdvanced" />
                  </a-tooltip>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <!-- <a-button v-action:delete type="danger" icon="delete">删除</a-button> -->
      </div>

      <!-- 切换标签 -->
      <div class="tabs">
        <a-tabs default-active-key="1" @change="changeTabs">
          <a-tab-pane key="1" tab="全部">
          </a-tab-pane>
          <a-tab-pane key="2" tab="待支付">
          </a-tab-pane>
          <a-tab-pane key="3" tab="进行中">
          </a-tab-pane>
          <a-tab-pane key="4" tab="已完成">
          </a-tab-pane>
          <a-tab-pane key="5" tab="已取消">
          </a-tab-pane>
          <a-tab-pane key="6" tab="已退诊">
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 医生操作抽屉 -->
      <a-drawer width="50%" :title="actionTitle" :visible="actionVisible" :after-visible-change="afterActionVisibleChange" @close="actionOnClose">
        <div class="actionBox">
          <div class="actionBox-title">患者信息</div>
          <div class="content">
            <a-descriptions :column="4">
              <a-descriptions-item label="患者姓名">
                {{patientInfo.name}}
              </a-descriptions-item>
              <a-descriptions-item label="性别">
                {{patientInfo.sex}}
              </a-descriptions-item>
              <a-descriptions-item label="年龄">
                {{patientInfo.age}}
              </a-descriptions-item>
              <a-descriptions-item label="手机">
                {{patientInfo.mobile}}
              </a-descriptions-item>
              <a-descriptions-item label="病情描述" :span="4">
                {{patientInfo.description}}
              </a-descriptions-item>
              <a-descriptions-item label="就诊情况">
                {{patientInfo.situation}}
              </a-descriptions-item>
              <a-descriptions-item label="预约时间" :span="2">
                {{patientInfo.appointment}}
              </a-descriptions-item>
              <a-descriptions-item label="提交时间">
                {{patientInfo.submitTime}}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>

        <div class="actionBox">
          <div class="actionBox-title">订单信息</div>
          <div class="content">
            <a-descriptions :column="3">
              <a-descriptions-item label="订单编号">
                {{orderInfo.no}}
              </a-descriptions-item>
              <a-descriptions-item label="订单类型">
                {{orderInfo.type}}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                {{orderInfo.status}}
              </a-descriptions-item>
              <a-descriptions-item label="应付金额">
                {{orderInfo.shouldPay}}
              </a-descriptions-item>
              <a-descriptions-item label="优惠券">
                {{orderInfo.coupon}}
              </a-descriptions-item>
              <a-descriptions-item label="实际支付">
                {{orderInfo.pay}}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{orderInfo.createTime}}
              </a-descriptions-item>
              <a-descriptions-item label="支付方式">
                {{orderInfo.payMode}}
              </a-descriptions-item>
              <a-descriptions-item label="支付时间">
                {{orderInfo.payTime}}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>

        <div class="actionBox">
          <div class="actionBox-title">接诊信息</div>
          <div class="content">
            <a-descriptions :column="2">
              <a-descriptions-item label="接诊时间">
                {{admissionInfo.admissionTime}}
              </a-descriptions-item>
              <a-descriptions-item label="通话时长">
                {{admissionInfo.duration}}
              </a-descriptions-item>
              <a-descriptions-item label="患者评分" :span="2">
                <a-rate v-model="admissionInfo.score" disabled />
              </a-descriptions-item>
              <a-descriptions-item label="患者评价" :span="2">
                {{admissionInfo.evaluation}}
              </a-descriptions-item>
            </a-descriptions>
          </div>
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
    </a-card>
  </page-header-wrapper>
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
    title: '提交问诊时间',
    dataIndex: 'time',
  },
  {
    title: '患者',
    dataIndex: 'name',
  },
  {
    title: '科室',
    dataIndex: 'room',
  },
  {
    title: '医生',
    dataIndex: 'doctor',
  },
  {
    title: '方式',
    dataIndex: 'type',
  },
  {
    title: '来源',
    dataIndex: 'from',
  },
  {
    title: '问诊费',
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
    name: '田田',
    time: '2020-02-07 21:00:00',
    room: '内科',
    doctor: '张三',
    type: '视频问诊',
    from: '视频问诊',
    cost: '20',
    status: '待支付',
  })
}
export default {
  name: 'Questionnaire',
  inject: ['reloadCard'],
  data() {
    return {
      advanced: true,
      // 搜索栏
      search: true,
      queryParam: {
        // resName: '',
        // status: undefined,
        // type: undefined,
        // from: undefined,
        // data: null,
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
      patientInfo: {
        name: '田田',
        sex: '男',
        age: 43,
        mobile: '18812345678',
        description: '最近一个月总是头晕、头痛、疲劳、心悸等，有时还会出现注意力不集中、记忆力减退、肢体麻木的现象',
        situation: '未去医院就过诊',
        appointment: '2020-03-04  周一  18：00-22：00',
        submitTime: '2020-03-04  11：08：18',
      },
      orderInfo: {
        no: '20200408121324',
        type: '视频问诊',
        status: '已完成',
        shouldPay: '￥40',
        coupon: '￥10',
        pay: '￥30',
        createTime: '2020-03-04  11：08：18',
        payMode: '微信',
        payTime: '2020-03-04  11：08：18',
      },
      admissionInfo: {
        admissionTime: '2020-03-04  周一  18：20',
        duration: '00：16',
        score: 5,
        evaluation:
          '张医生经验丰富，医术精湛，用药精准。因为头晕看了数十位大夫都没有起色，在app上找到张主任，吃药后病情好转了',
      },
    }
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
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
    height: 128px;
  }
}
.mask-enter-active {
  animation: mask-in 0.2s linear;
}
.mask-leave-active {
  animation: mask-in 0.2s reverse linear;
}
.contentBox {
  .search {
    height: 128px;
  }
}
.actionBox {
  .content {
    padding: 24px;
  }
}
</style>