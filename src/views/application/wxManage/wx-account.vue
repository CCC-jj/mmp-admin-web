<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="mod-config">
        <a-form-model layout="inline" :model="dataForm" @keyup.enter.native="getDataList()">
          <a-form-model-item>
            <a-input v-model="dataForm.key" placeholder="参数名" clearable></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button @click="getDataList()">查询</a-button>
            <a-button v-if="$auth('wxManage.add')" type="primary" @click="addOrUpdateHandle()">新增</a-button>
            <a-button v-if="$auth('wxManage.delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</a-button>
          </a-form-model-item>
        </a-form-model>

        <a-table style="margin-top:40px;" bordered :loading="dataListLoading" :columns="columnsList" :data-source="dataList" :row-selection="{selectedRowKeys: dataListSelections, onChange: selectionChangeHandle}">
          <span slot="verified" slot-scope="text">{{text?"是":"否"}}</span>
          <template slot="action" slot-scope="text,record">
            <a-button type="text" size="small" @click="accessInfo(record.row)">接入</a-button>
            <a-button type="text" size="small" @click="addOrUpdateHandle(record.row)">修改</a-button>
            <a-button type="text" size="small" @click="deleteHandle(record.row.appid)">删除</a-button>
          </template>
        </a-table>

        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <account-access v-if="accountAccessVisible" ref="accountAccessDialog"></account-access>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import AddOrUpdate from './account/wx-account-add-or-update'
import AccountAccess from './account/wx-account-access-info'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dataForm: {
        key: '',
      },
      columnsList: [
        { title: 'appid', dataIndex: 'appid' },
        { title: '公众号名称', dataIndex: 'name' },
        { title: '类型', dataIndex: 'type' },
        { title: '是否认证', dataIndex: 'verified', scopedSlots: { customRender: 'verified' } },
        { title: '操作', dataIndex: '', scopedSlots: { customRender: 'action' } },
      ],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      accountAccessVisible: false,
    }
  },
  components: {
    AddOrUpdate,
    AccountAccess,
  },
  computed: mapState({
    ACCOUNT_TYPES: (state) => state.wxManage.ACCOUNT_TYPES,
  }),
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      //   this.dataListLoading = true
      //   this.$http({
      //     url: this.$http.adornUrl('/manage/wxAccount/list'),
      //     method: 'get',
      //     params: this.$http.adornParams({
      //       key: this.dataForm.key,
      //     }),
      //   }).then(({ data }) => {
      //     if (data && data.code === 200) {
      //       this.dataList = data.list
      //       this.$store.commit('wxAccount/updateAccountList', data.list)
      //     } else {
      //       this.dataList = []
      //     }
      //     this.dataListLoading = false
      //   })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(item) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(item)
      })
    },
    accessInfo(item) {
      this.accountAccessVisible = true
      this.$nextTick(() => {
        this.$refs.accountAccessDialog.init(item)
      })
    },
    // 删除
    deleteHandle(appid) {
      var ids = appid
        ? [appid]
        : this.dataListSelections.map((item) => {
            return item.appid
          })
      this.$confirm(`确定对[appid=${ids.join(',')}]进行[${appid ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/manage/wxAccount/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              },
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    accountTypeFormat(row, column, cellValue) {
      return this.ACCOUNT_TYPES[cellValue]
    },
  },
}
</script>
