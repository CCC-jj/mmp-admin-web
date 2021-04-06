<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
export default {
  data() {
    return {
      zh_CN,
    }
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
/* 滚动条宽度 */
::-webkit-scrollbar {
  width: 7px;
  height: 10px;
}
/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #c9c9c9;
  border-radius: 3px;
}
/* 禁用状态字体颜色 */
.ant-input-disabled {
  color: rgba(0, 0, 0, 0.65) !important;
}
.ant-select-selection__rendered {
  color: rgba(0, 0, 0, 0.65) !important;
}
.ant-input-number-disabled {
  color: rgba(0, 0, 0, 0.65) !important;
}
/* 表格英文强制换行 */
.ant-table-tbody > tr > td {
  word-break: break-all;
}
</style>
