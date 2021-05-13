<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="mod-config">
        <a-form-model layout="inline" :model="dataForm" @keyup.enter.native="getDataList()">
          <a-form-model-item>
            <a-input v-model="dataForm.matchValue" placeholder="匹配关键词" clearable></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button @click="getDataList()">查询</a-button>
            <a-button v-if="$auth('wxManage.add')" type="primary" @click="addOrUpdateHandle()">新增</a-button>
            <a-button v-if="$auth('wxManage.delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</a-button>
          </a-form-model-item>
        </a-form-model>
        <a-table bordered :loading="dataListLoading" :columns="columnsList" :data-source="dataList" :row-selection="{selectedRowKeys: dataListSelections, onChange: selectionChangeHandle}">
          <template slot="expandedRowRender" slot-scope="record" style="margin: 0">
            <a-form-model label-position="left" inline class="demo-table-expand">
              <a-form-model-item label="作用范围">
                <span>{{ record.row.appid?'当前公众号':'全部公众号' }}</span>
              </a-form-model-item>
              <a-form-model-item label="精确匹配">
                <span>{{ record.row.exactMatch?'是':'否' }}</span>
              </a-form-model-item>
              <a-form-model-item label="是否有效">
                <span>{{ record.row.status?'是':'否' }}</span>
              </a-form-model-item>
              <a-form-model-item label="备注说明">
                <span>{{ record.row.desc }}</span>
              </a-form-model-item>
              <a-form-model-item label="生效时间">
                <span>{{ record.row.effectTimeStart }}</span>
              </a-form-model-item>
              <a-form-model-item label="失效时间">
                <span>{{ record.row.effectTimeEnd }}</span>
              </a-form-model-item>
            </a-form-model>
          </template>
          <template slot="action" slot-scope="text,record">
            <a-button type="text" size="small" @click="addOrUpdateHandle(record.row.ruleId)">修改</a-button>
            <a-button type="text" size="small" @click="deleteHandle(record.row.ruleId)">删除</a-button>
          </template>
        </a-table>
        <a-pagination @showSizeChange="sizeChangeHandle" @change="currentChangeHandle" :current="pageIndex" :pageSizeOptions="['10', '20', '50', '100']" :pageSize="pageSize" :total="totalCount">
        </a-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import AddOrUpdate from './msg-reply-rule-add-or-update'
import { mapState } from 'vuex'
export default {
  components: {
    AddOrUpdate,
  },
  data() {
    return {
      dataForm: {
        matchValue: '',
      },
      columnsList: [
        { title: '规则名称', dataIndex: 'ruleName' },
        { title: '匹配关键词', dataIndex: 'matchValue' },
        { title: '消息类型', dataIndex: 'replyType' },
        { title: '回复内容', dataIndex: 'replyContent' },
        { title: '操作', dataIndex: '', scopedSlots: { customRender: 'action' } },
      ],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
    }
  },
  computed: mapState({
    KefuMsgType: (state) => state.message.KefuMsgType,
  }),

  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      // this.$http({
      //     url: this.$http.adornUrl('/manage/msgReplyRule/list'),
      //     method: 'get',
      //     params: this.$http.adornParams({
      //         'page': this.pageIndex,
      //         'limit': this.pageSize,
      //         'matchValue': this.dataForm.matchValue
      //     })
      // }).then(({ data }) => {
      //     if (data && data.code === 200) {
      //         this.dataList = data.page.list
      //         this.totalCount = data.page.totalCount
      //     } else {
      //         this.dataList = []
      //         this.totalCount = 0
      //     }
      //     this.dataListLoading = false
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
      var ids = id ? [id] : this.dataListSelections.map((item) => item.ruleId)
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/manage/msgReplyRule/delete'),
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
    replyTypeFormat(row, column, cellValue) {
      return this.KefuMsgType[cellValue]
    },
  },
}
</script>
