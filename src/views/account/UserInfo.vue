<template>
  <div class="userInfo">
    <h1 class="title">个人信息</h1>
    <a-descriptions bordered>
      <a-descriptions-item label="姓名" :span="3">
        {{userInfo.name}}
      </a-descriptions-item>
      <a-descriptions-item label="性别" :span="3">
        <span v-if="userInfo.sex===0">未知</span>
        <span v-else-if="userInfo.sex===1">男</span>
        <span v-else-if="userInfo.sex===2">女</span>
        <span v-else>保密</span>
      </a-descriptions-item>
      <a-descriptions-item label="手机号码" :span="3">
        {{userInfo.mobile}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { getPersonInfo } from '@/api/account'
export default {
  name: 'UserInfo',
  data() {
    return {
      userInfo: {},
    }
  },
  mounted() {
    getPersonInfo()
      .then((res) => {
        if (res.success) {
          this.userInfo = res.data
        } else {
          this.$message.warning(res.message)
        }
      })
      .catch((err) => {
        console.error(err)
      })
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
  },
}
</script>

<style scoped>
.title {
  font-size: 24px;
  margin-bottom: 30px;
}
.userInfo /deep/ .ant-descriptions-item-label {
  width: 25%;
}
</style>