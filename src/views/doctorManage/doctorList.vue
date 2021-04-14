<template>
  <div class="doctorList">
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
              <a-form-model-item label="科室" prop="room">
                <a-select v-model="queryInfo.room" placeholder="请选择科室">
                  <a-select-option value="内分泌科">
                    内分泌科
                  </a-select-option>
                  <a-select-option value="内科">
                    内科
                  </a-select-option>
                  <a-select-option value="消化科">
                    消化科
                  </a-select-option>
                  <a-select-option value="儿科">
                    儿科
                  </a-select-option>
                  <a-select-option value="中医科">
                    中医科
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="职称" prop="job">
                <a-select v-model="queryInfo.job" placeholder="请选择职称">
                  <a-select-option value="主任医师">
                    主任医师
                  </a-select-option>
                  <a-select-option value="副主任医师">
                    副主任医师
                  </a-select-option>
                  <a-select-option value="主治医师">
                    主治医师
                  </a-select-option>
                  <a-select-option value="住院医师">
                    住院医师
                  </a-select-option>
                  <a-select-option value="药剂师">
                    药剂师
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
      <a-row type="flex" justify="space-between">
        <a-col>
          <a-space>
            <a-button type="primary" icon="plus" @click="addDoctor">新增医生</a-button>
            <a-button icon="import">批量导入</a-button>
          </a-space>
        </a-col>
        <a-col>
          <a-space>
            <a-tooltip title="刷新">
              <a-button shape="circle" icon="reload" @click="refresh" />
            </a-tooltip>
            <a-tooltip title="搜索">
              <a-button shape="circle" icon="search" @click="showSearch" />
            </a-tooltip>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <!-- 切换标签 -->
    <div class="tabs">
      <a-tabs default-active-key="1" @change="changeTabs">
        <a-tab-pane key="1" tab="全部">
        </a-tab-pane>
        <a-tab-pane key="2" tab="审核通过">
        </a-tab-pane>
        <a-tab-pane key="3" tab="审核未通过">
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 菜单表格 -->
    <div class="table">
      <a-table size="middle" :expandIconColumnIndex="2" :loading="tableLoading" bordered :data-source="dataSource" :columns="columns" :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :rowKey="(record, index) => {return record.key}" :pagination="{ showSizeChanger: true, showQuickJumper: true, pageSize: 10, total: 50, current: 1, showTotal: ((total) => {return `共 ${total} 条`}) }">
        <template slot="action" slot-scope="text,record">
          <a-space :size="15">
            <a @click="toView(record)">
              <a-icon type="eye" /> 查看
            </a>
            <a @click="toEdit(record)">
              <a-icon type="edit" /> 查看粉丝
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
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '电话',
    dataIndex: 'mobile',
  },
  {
    title: '医院',
    dataIndex: 'hospital',
  },
  {
    title: '科室',
    dataIndex: 'room',
  },
  {
    title: '职称',
    dataIndex: 'job',
  },
  {
    title: '加入时间',
    dataIndex: 'joinTime',
  },
  {
    title: '审核状态',
    dataIndex: 'status',
  },
  {
    title: '服务审核',
    dataIndex: 'service',
  },
  {
    title: '粉丝',
    dataIndex: 'fans',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    width: '230px',
  },
]
const dataSource = []
for (let i = 0; i < 8; i++) {
  dataSource.push({
    key: i,
    name: '秦山',
    mobile: '18811110000',
    hospital: '北大医院',
    room: '内科',
    job: '主任医师',
    joinTime: '2020-02-07 21:00:00',
    status: '已通过',
    service: '已审核',
    fans: '12',
  })
}
export default {
  name: 'DoctorList',
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
    addDoctor() {},
    refresh() {
      this.reloadCard()
    },
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
.doctorList {
  background: #fff;
  padding: 24px;
  .search {
    height: 65px;
    overflow: hidden;
  }
}
</style>