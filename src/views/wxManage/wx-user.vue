<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="mod-config">
        <a-form-model layout="inline" :model="dataForm" @keyup.enter.native="getDataList()">
          <a-form-model-item>
            <a-select v-model="dataForm.tagid" filterable clearable placeholder="用户标签">
              <a-select-option v-for="item in wxUserTags" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="dataForm.nickname" placeholder="昵称" clearable></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="dataForm.city" placeholder="城市" clearable></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="dataForm.qrSceneStr" placeholder="关注场景值" clearable></a-input>
          </a-form-model-item>
          <a-form-model-item>
            <a-button @click="getDataList()">查询</a-button>
            <a-button v-if="$auth('wxManage.add')" type="primary" @click="$refs.wxUserTagging.init('tagging')" :disabled="dataListSelections.length <= 0">绑定标签</a-button>
            <a-button v-if="$auth('wxManage.add')" type="primary" @click="$refs.wxUserTagging.init('untagging')" :disabled="dataListSelections.length <= 0">解绑标签</a-button>
            <a-button v-if="$auth('wxManage.delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</a-button>
          </a-form-model-item>
          <a-form-model-item class="fr">
            <a-button icon="tag" type="success" @click="$refs.wxUserTagsEditor.show()">标签管理</a-button>
            <a-button icon="swap" type="success" @click="syncWxUsers()">同步粉丝</a-button>
          </a-form-model-item>
        </a-form-model>

        <a-table bordered :loading="dataListLoading" :columns="columnsList" :data-source="dataList" :row-selection="{selectedRowKeys: dataListSelections, onChange: selectionChangeHandle}">
          <template slot="headimgurl" slot-scope="text">
            <img class="headimg" v-if="text" :src="text" />
          </template>
          <template slot="tagidList" slot-scope="text">
            <span v-for="tagid in text" :key="tagid">{{getTagName(tagid)}} </span>
          </template>
          <span slot="subscribeTime" slot-scope="text">
            {{$moment(text).calendar()}}
          </span>
          <span slot="subscribe" slot-scope="text">{{text?"是":"否"}}</span>
          <template slot="action" slot-scope="text,record">
            <a-button type="text" size="small" @click="deleteHandle(record.row.openid)">删除</a-button>
          </template>
        </a-table>

        <a-pagination @showSizeChange="sizeChangeHandle" @change="currentChangeHandle" :current="pageIndex" :pageSizeOptions="['10', '20', '50', '100']" :pageSize="pageSize" :total="totalPage" >
        </a-pagination>
        <wx-user-tags-manager ref="wxUserTagsEditor" ></wx-user-tags-manager>
        <wx-user-tagging ref="wxUserTagging" :wxUsers="dataListSelections"></wx-user-tagging>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import WxUserTagsManager from '@/components/wx-user-tags-manager'
import WxUserTagging from './wx-user-tagging'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dataForm: {
        tagid: '',
        nickname: '',
        city: '',
        qrSceneStr: '',
      },
      columnsList: [
        { title: 'openid', dataIndex: 'openid' },
        { title: '昵称', dataIndex: 'nickname' },
        { title: '性别', dataIndex: 'sex' },
        { title: '城市', dataIndex: 'city' },
        { title: '头像', dataIndex: 'headimgurl', scopedSlots: { customRender: 'headimgurl' } },
        { title: '标签', dataIndex: 'tagidList', scopedSlots: { customRender: 'tagidList' } },
        { title: '订阅时间', dataIndex: 'subscribeTime', scopedSlots: { customRender: 'subscribeTime' } },
        { title: '场景值', dataIndex: 'qrSceneStr' },
        { title: '是否关注', dataIndex: 'subscribe', scopedSlots: { customRender: 'subscribe' } },
        { title: '操作', dataIndex: '', scopedSlots: { customRender: 'action' } },
      ],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      showWxUserTagsEditor: false,
    }
  },
  components: {
    WxUserTagsManager,
    WxUserTagging,
  },
  activated() {
    this.getDataList()
  },
  computed: mapState({
    wxUserTags: (state) => state.wxManage.tags,
  }),
  methods: {
    // 获取数据列表
    getDataList() {
    //   this.dataListLoading = true
    //   this.$http({
    //     url: this.$http.adornUrl('/manage/wxUser/list'),
    //     method: 'get',
    //     params: this.$http.adornParams({
    //       page: this.pageIndex,
    //       limit: this.pageSize,
    //       nickname: this.dataForm.nickname,
    //       tagid: this.dataForm.tagid,
    //       city: this.dataForm.city,
    //       qrSceneStr: this.dataForm.qrSceneStr,
    //       sidx: 'subscribe_time',
    //       order: 'desc',
    //     }),
    //   }).then(({ data }) => {
    //     if (data && data.code === 200) {
    //       this.dataList = data.page.list
    //       this.totalPage = data.page.totalCount
    //     } else {
    //       this.dataList = []
    //       this.totalPage = 0
    //     }
    //     this.dataListLoading = false
    //   })
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
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map((item) => item.openid)
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/manage/wxUser/delete'),
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
    syncWxUsers() {
      this.$http({
        url: this.$http.adornUrl('/manage/wxUser/syncWxUsers'),
        method: 'post',
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            message: '同步任务已建立，请稍候刷新查看列表',
            type: 'success',
            duration: 1500,
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    sexFormat(row, column, cellValue) {
      let sexType = {
        0: '未知',
        1: '男',
        2: '女',
      }
      return sexType[cellValue]
    },
    getTagName(tagid) {
      let tag = this.wxUserTags.find((item) => item.id == tagid)
      return tag ? tag.name : '?'
    },
    closeWxUserTagsEditor() {
      this.showWxUserTagsEditor = false
    },
  },
}
</script>
<style scoped>
.headimg {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}
</style>