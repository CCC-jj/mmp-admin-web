<template>
  <div class="mod-config">
    <a-form-model layout="inline" :model="dataForm" @keyup.enter.native="getDataList()">
      <a-form-model-item>
        <a-input v-model="dataForm.title" placeholder="标题" clearable></a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-space>
          <a-button @click="getDataList()">查询</a-button>
          <a-button v-if="$auth('wxManage.add')" type="success" @click="copyHandle()" :disabled="dataListSelections.length <= 0">批量复制</a-button>
          <a-button v-if="$auth('wxManage.add')" type="success" @click="templateMsgTaskHandle()" :disabled="dataListSelections.length!=1">推送消息</a-button>
          <a-button v-if="$auth('wxManage.delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</a-button>
        </a-space>
      </a-form-model-item>
      <a-form-model-item class="fr">
        <a-space>
          <a-button v-if="$auth('wxManage.add')" icon="el-icon-sort" type="success" @click="syncWxTemplate()" :disabled="synchonizingWxTemplate">{{synchonizingWxTemplate?'同步中...':'同步公众号模板'}}</a-button>
          <a-button type="primary" icon="link"><a style="color:#fff" target="_blank" href="https://kf.qq.com/faq/170209E3InyI170209nIF7RJ.html">模板管理指引</a></a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>

    <a-table style="margin-top:40px;" bordered :loading="dataListLoading" :columns="columnsList" :data-source="dataList" :row-selection="{selectedRowKeys: dataListSelections, onChange: selectionChangeHandle}">
      <template slot="titles" slot-scope="text,record">
        <a :href="record.row.url">{{record.row.title}}</a>
      </template>
      <span slot="status" slot-scope="text">{{text?"是":"否"}}</span>
      <template slot="action" slot-scope="text,record">
        <a-button type="text" size="small" @click="addOrUpdateHandle(record.row.id)">配置</a-button>
        <a-button type="text" size="small" @click="deleteHandle(record.row.id)">删除</a-button>
      </template>
    </a-table>
    <a-pagination @showSizeChange="sizeChangeHandle" @change="currentChangeHandle" :current="pageIndex" :pageSizeOptions="['10', '20', '50', '100']" :pageSize="pageSize" :total="totalCount">
    </a-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <template-msg-task v-if="templateMsgTaskVisible" ref="templateMsgTask"></template-msg-task>
  </div>
</template>

<script>
import AddOrUpdate from './msg-template-add-or-update'
import TemplateMsgTask from '@/components/template-msg-task'
export default {
  data() {
    return {
      dataForm: {
        title: '',
      },
      columnsList: [
        { title: '模板ID', dataIndex: 'templateId' },
        { title: '标题', dataIndex: 'title', scopedSlots: { customRender: 'titles' } },
        { title: '模版名称', dataIndex: 'name' },
        { title: '模版字段', dataIndex: 'content' },
        { title: '是否有效', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
        { title: '操作', dataIndex: '', scopedSlots: { customRender: 'action' } },
      ],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      templateMsgTaskVisible: false,
      synchonizingWxTemplate: false,
    }
  },
  components: {
    AddOrUpdate,
    TemplateMsgTask,
  },
  activated() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      // this.dataListLoading = true
      // this.$http({
      //   url: this.$http.adornUrl('/manage/msgTemplate/list'),
      //   method: 'get',
      //   params: this.$http.adornParams({
      //     page: this.pageIndex,
      //     limit: this.pageSize,
      //     title: this.dataForm.title,
      //     sidx: 'id',
      //     order: 'desc',
      //   }),
      // }).then(({ data }) => {
      //   if (data && data.code === 200) {
      //     this.dataList = data.page.list
      //     this.totalCount = data.page.totalCount
      //   } else {
      //     this.dataList = []
      //     this.totalCount = 0
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
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/manage/msgTemplate/delete'),
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
    syncWxTemplate() {
      if (this.synchonizingWxTemplate) return
      this.synchonizingWxTemplate = true
      this.$http({
        url: this.$http.adornUrl('/manage/msgTemplate/syncWxTemplate'),
        method: 'post',
      })
        .then(({ data }) => {
          this.synchonizingWxTemplate = false
          if (data && data.code === 200) {
            this.$message({
              message: '同步完成',
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
        .catch(() => (this.synchonizingWxTemplate = false))
    },
    templateMsgTaskHandle() {
      this.templateMsgTaskVisible = true
      this.$nextTick(() => {
        this.$refs.templateMsgTask.init(this.dataListSelections[0])
      })
    },
    async copyHandle() {
      let loading
      for (let i = 0; i < this.dataListSelections.length; i++) {
        let item = this.dataListSelections[i]
        loading = this.$loading({
          lock: true,
          text: '复制模板：' + item.title,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        item.id = ''
        item.updateTime = new Date()
        item.name += '_COPY'
        await this.addMsgTemplate(item).catch(() => loading.close())
        loading.close()
      }
      loading.close()
      this.getDataList()
    },
    addMsgTemplate(msgTemplate) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/manage/msgTemplate/save'),
          method: 'post',
          data: this.$http.adornData(msgTemplate),
        })
          .then(({ data }) => {
            if (data && data.code === 200) {
              resolve()
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
          .catch((err) => reject(err))
      })
    },
  },
}
</script>