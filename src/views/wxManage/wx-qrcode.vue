<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="mod-config">
        <a-form-model layout="inline" :model="dataForm" @keyup.enter.native="getDataList()">
          <a-form-model-item>
            <a-input v-model="dataForm.sceneStr" placeholder="场景值" clearable></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button @click="getDataList()">查询</a-button>
            <a-button v-if="$auth('wxManage.add')" type="primary" @click="addOrUpdateHandle()">新增</a-button>
            <a-button v-if="$auth('wxManage.delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</a-button>
          </a-form-model-item>
        </a-form-model>
        <a-table style="margin-top:40px;" bordered :loading="dataListLoading" :columns="columnsList" :data-source="dataList" :row-selection="{selectedRowKeys: dataListSelections, onChange: selectionChangeHandle}">
          <span slot="isTemp" slot-scope="text">{{text?'临时':'永久'}}</span>
          <span slot="ticket" slot-scope="text">
            <a :href="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+text">{{text}}</a>
          </span>
          <span slot="url" slot-scope="text">
            <a :href="text">{{text}}</a>
          </span>
          <template slot="action" slot-scope="text,record">
            <a-button type="text" size="small" @click="deleteHandle(record.row.id)">删除</a-button>
          </template>
        </a-table>

        <a-pagination @showSizeChange="sizeChangeHandle" @change="currentChangeHandle" :current="pageIndex" :pageSizeOptions="['10', '20', '50', '100']" :pageSize="pageSize" :total="totalPage">
        </a-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import AddOrUpdate from './wx-qrcode-add-or-update'
export default {
  data() {
    return {
      dataForm: {
        sceneStr: '',
      },
      columnsList: [
        { title: 'ID', dataIndex: 'id' },
        { title: '类型', dataIndex: 'isTemp', scopedSlots: { customRender: 'isTemp' } },
        { title: '场景值', dataIndex: 'sceneStr' },
        { title: '二维码图片', dataIndex: 'ticket', scopedSlots: { customRender: 'ticket' } },
        { title: '解析后的地址', dataIndex: 'url', scopedSlots: { customRender: 'url' } },
        { title: '失效时间', dataIndex: 'expireTime' },
        { title: '操作', dataIndex: '', scopedSlots: { customRender: 'action' } },
      ],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    }
  },
  components: {
    AddOrUpdate,
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      // this.dataListLoading = true
      // this.$http({
      //   url: this.$http.adornUrl('/manage/wxQrCode/list'),
      //   method: 'get',
      //   params: this.$http.adornParams({
      //     page: this.pageIndex,
      //     limit: this.pageSize,
      //     sceneStr: this.dataForm.sceneStr,
      //     sidx: 'id',
      //     order: 'desc',
      //   }),
      // }).then(({ data }) => {
      //   if (data && data.code === 200) {
      //     this.dataList = data.page.list
      //     this.totalPage = data.page.totalCount
      //   } else {
      //     this.dataList = []
      //     this.totalPage = 0
      //   }
      //   this.dataListLoading = false
      // })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map((item) => item.id)
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?（仅删存档）`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/manage/wxQrCode/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => this.getDataList(),
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
  },
}
</script>
