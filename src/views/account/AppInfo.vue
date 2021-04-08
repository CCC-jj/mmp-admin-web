<template>
  <div class="appInfo">
    <h1 class="title">应用信息</h1>
    <a-descriptions bordered>
      <a-descriptions-item label="客户端代码" :span="3">
        {{appInfo.clientId}}
      </a-descriptions-item>
      <a-descriptions-item label="客户端名称" :span="3">
        {{appInfo.clientName}}
      </a-descriptions-item>
      <a-descriptions-item label="客户端秘钥" :span="3">
        {{appInfo.clientSecret}}
      </a-descriptions-item>
      <a-descriptions-item label="客户端状态" :span="3">
        <span v-if="appInfo.clientStatus===1">正常</span>
        <span v-else-if="appInfo.clientStatus===2">禁用</span>
        <span v-else>已删除</span>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { getClientInfo } from '@/api/account'
export default {
  name: 'AppInfo',
  data() {
    return {
      appInfo: {},
    }
  },
  mounted() {
    getClientInfo()
      .then((res) => {
        if (res.success) {
          this.appInfo = res.data
        } else {
          this.$message.warning(res.message)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
}
</script>

<style scoped>
.title {
  font-size: 24px;
  margin-bottom: 30px;
}
/* .appInfo > div {
  font-size: 18px;
  border-bottom: 1px solid #e1e1e1;
  height: 65px;
	padding: 20px 0;
} */
.appInfo /deep/ .ant-descriptions-item-label {
  width: 25%;
}
</style>