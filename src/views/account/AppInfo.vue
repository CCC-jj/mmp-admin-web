<template>
  <div class="appInfo">
    <h1 class="title">应用信息</h1>
		<a-descriptions bordered>
      <a-descriptions-item label="AppId（应用Id）" :span="3">
        {{appInfo.appId}}
      </a-descriptions-item>
      <a-descriptions-item label="AppSecret（应用密钥）" :span="3">
				{{appInfo.appSecret}}
      </a-descriptions-item>
      <a-descriptions-item label="接口地址" :span="3">
        {{appInfo.apiUrl}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
// import { getAppAccount } from '@/api/app'
export default {
  name: 'AppInfo',
  data() {
    return {
      appInfo: {},
    }
  },
  mounted() {
    // getAppAccount()
    //   .then((result) => {
    //     if (result.success) {
    //       this.appInfo = result.data
    //     } else {
    //       this.$message.warning(result.message)
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
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
.appInfo /deep/ .ant-descriptions-item-label{
	width: 25%;
}
</style>