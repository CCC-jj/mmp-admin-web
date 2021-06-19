<template>
  <div class="mod-config">
    <a-form-model layout="inline" :model="dataForm" @keyup.enter.native="getDataList()">
      <a-form-model-item>
        <a-select v-model="dataForm.startTime" placeholder="时间">
          <a-select-option v-for="(name,key) in timeSelections" :key="key" :value="name">{{key}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-select v-model="dataForm.msgTypes" placeholder="消息类型">
          <a-select-option value="">不限类型</a-select-option>
          <a-select-option value="text,image,voice,shortvideo,video,news,music,location,link">消息</a-select-option>
          <a-select-option value="event,transfer_customer_service">事件</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="getDataList()">查询</a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="text-gray">
      24小时内消息可回复。此后台展示消息有一分钟左右延迟，如需畅聊请使用
      <a href="https://mpkf.weixin.qq.com/" target="_blank">公众平台客服</a>
    </div>
    <a-spin size="large" :spinning="dataListLoading" :indicator="indicator">
      <div>
        <div class="msg-item" v-for="(msg,index) in  dataList" :key="index">
          <div class="avatar">
            <el-avatar shape="square" :size="60" :src="getUserInfo(msg.openid).headimgurl"></el-avatar>
          </div>
          <div class="item-content">
            <div class="flex justify-between margin-bottom">
              <div class="text-cut">{{getUserInfo(msg.openid).nickname || '--'}}</div>
              <div>{{$moment(msg.createTime).calendar()}}</div>
              <div class="reply-btn">
                <div v-if="canReply(msg.createTime)" @click="replyHandle(msg.openid)" class="el-icon-s-promotion">回复</div>
              </div>
            </div>
            <wx-msg-preview :msg="msg" singleLine></wx-msg-preview>
          </div>
        </div>
      </div>
    </a-spin>
    <a-pagination @showSizeChange="sizeChangeHandle" @change="currentChangeHandle" :current="pageIndex" :pageSizeOptions="['10', '20', '50', '100']" :pageSize="pageSize" :total="totalCount">
    </a-pagination>
    <!-- 弹窗, 消息回复 -->
    <wx-msg-reply ref="wxMsgReply" @success="onReplyed"></wx-msg-reply>
  </div>
</template>

<script>
import moment from 'moment'
const TIME_FORMAT = 'YYYY/MM/DD hh:mm:ss'
export default {
  data() {
    return {
      timeSelections: {
        近24小时: moment().subtract(1, 'days').format(TIME_FORMAT),
        近3天: moment().subtract(3, 'days').format(TIME_FORMAT),
        近7天: moment().subtract(7, 'days').format(TIME_FORMAT),
        近30天: moment().subtract(30, 'days').format(TIME_FORMAT),
      },
      dataForm: {
        startTime: moment().subtract(1, 'days').format(TIME_FORMAT),
        msgTypes: '',
      },
      dataList: [],
      userDataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      indicator: <a-icon type="loading" style="font-size: 40px" spin />,
    }
  },
  components: {
    WxMsgReply: () => import('./wx-msg-reply'),
    WxMsgPreview: () => import('@/components/wx-msg-preview'),
  },
  activated() {
    this.getDataList()
  },
  methods: {
    moment,
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      //   this.$http({
      //     url: this.$http.adornUrl('/manage/wxMsg/list'),
      //     method: 'get',
      //     params: this.$http.adornParams({
      //       page: this.pageIndex,
      //       limit: this.pageSize,
      //       msgTypes: this.dataForm.msgTypes,
      //       startTime: this.dataForm.startTime,
      //       sidx: 'create_time',
      //       order: 'desc',
      //     }),
      //   }).then(({ data }) => {
      //     if (data && data.code === 200) {
      //       this.dataList = data.page.list
      //       this.totalCount = data.page.totalCount
      //       this.refreshUserList(this.dataList)
      //     } else {
      //       this.dataList = []
      //       this.totalCount = 0
      //     }
      //     this.dataListLoading = false
      //   })
    },
    refreshUserList(msgList) {
      let openidList = msgList
        .map((msg) => msg.openid)
        .filter((openid) => !this.userDataList.some((u) => u.openid == openid))
      if (!openidList.length) return
      openidList = Array.from(new Set(openidList)) //去重
      this.$http({
        url: this.$http.adornUrl('/manage/wxUser/listByIds'),
        method: 'post',
        data: this.$http.adornParams(openidList, false),
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.userDataList = this.userDataList.concat(data.data)
        }
      })
    },
    getUserInfo(openid) {
      return this.userDataList.find((u) => u.openid == openid) || { nickname: '--', headimgurl: '' }
    },
    // 是否可回复，24小时内可回复
    canReply(time) {
      return new Date(time).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000
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
    // 回复消息
    replyHandle(openid) {
      this.$nextTick(() => {
        this.$refs.wxMsgReply.init(openid)
      })
    },
    onReplyed(replyMsg) {
      this.dataList.unshift({
        openid: replyMsg.openid,
        msgType: replyMsg.replyType,
        detail: {
          content: replyMsg.replyContent,
        },
        inOut: 1,
        createTime: new Date(),
      })
    },
  },
}
</script>
<style scoped>
.msg-item {
  border: 1px solid #dcdfe6;
  display: flex;
  justify-content: flex-start;
  align-items: top;
  margin-top: 20px;
  padding: 10px 20px;
}
.avatar {
  flex: 0;
  display: inline-block;
  min-width: 60px;
  margin-right: 20px;
}
.item-content {
  flex: 1;
  line-height: 20px;
  max-width: 100%;
  overflow: hidden;
}
.reply-btn {
  width: 50px;
}
</style>