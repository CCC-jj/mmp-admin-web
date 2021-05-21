<template>
  <page-header-wrapper>
    <div class="mod-config">
      <a-card :bordered="false" class="ant-pro-components-tag-select">
        <a-form-model layout="inline" :model="dataForm" @keyup.enter.native="getDataList()">
          <a-form-model-item>
            <a-input v-model="dataForm.key" placeholder="参数名" clearable></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-space>
              <a-button @click="getDataList()">查询</a-button>
              <a-button v-if="$auth('wxManage.add')" type="primary" @click="addOrUpdateHandle()">新增</a-button>
              <a-button v-if="$auth('wxManage.delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</a-button>
            </a-space>
          </a-form-model-item>
        </a-form-model>
      </a-card>

      <!-- <a-table style="margin-top:40px;" bordered :loading="dataListLoading" :columns="columnsList" :data-source="dataList" :row-selection="{selectedRowKeys: dataListSelections, onChange: selectionChangeHandle}">
      <span slot="verified" slot-scope="text">{{text?"是":"否"}}</span>
      <template slot="action" slot-scope="text,record">
        <a-button type="text" size="small" @click="accessInfo(record.row)">接入</a-button>
        <a-button type="text" size="small" @click="addOrUpdateHandle(record.row)">修改</a-button>
        <a-button type="text" size="small" @click="deleteHandle(record.row.appid)">删除</a-button>
      </template>
    </a-table> -->

      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <account-access v-if="accountAccessVisible" ref="accountAccessDialog"></account-access>

      <div class="ant-pro-pages-list-applications-filterCardList">
        <a-list :loading="dataListLoading" :data-source="data" :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }" style="margin-top: 24px;">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card :body-style="{ paddingBottom: 20 }" hoverable>
              <a-card-meta :title="item.title">
                <template slot="avatar">
                  <a-avatar size="small" :src="item.avatar" />
                </template>
              </a-card-meta>
              <template slot="actions">
                <a-tooltip title="下载">
                  <a-icon type="download" />
                </a-tooltip>
                <a-tooltip title="编辑" @click="toEdit(item.title,item.id)">
                  <a-icon type="edit" />
                </a-tooltip>
                <a-tooltip title="分享">
                  <a-icon type="share-alt" />
                </a-tooltip>
                <a-dropdown>
                  <a class="ant-dropdown-link">
                    <a-icon type="ellipsis" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;">1st menu item</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">2nd menu item</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;">3rd menu item</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <div class="">
                <card-info active-user="100" new-user="999"></card-info>
              </div>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </page-header-wrapper>
</template>

<script>
import AddOrUpdate from './account/wx-account-add-or-update'
import AccountAccess from './account/wx-account-access-info'
import CardInfo from './components/CardInfo'
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
      data: [
        { id: '001', title: 'app1', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png' },
        { id: '002', title: 'app2', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png' },
        { id: '003', title: 'app3', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png' },
        { id: '004', title: 'app4', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png' },
        { id: '005', title: 'app5', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png' },
        { id: '006', title: 'app6', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png' },
      ],
    }
  },
  components: {
    AddOrUpdate,
    AccountAccess,
    CardInfo,
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
    toEdit(title, id) {
      console.log(title, id);
      this.$store.commit('wxManage/updateApptitle', title)
      this.$store.commit('wxManage/updateAppid', id)
      this.$router.push({ name: 'WxMenu', query: { id: id } })
    },
  },
}
</script>

<style lang="less" scoped>
.ant-pro-components-tag-select {
  /deep/ .ant-pro-tag-select .ant-tag {
    margin-right: 24px;
    padding: 0 8px;
    font-size: 14px;
  }
}
</style>
