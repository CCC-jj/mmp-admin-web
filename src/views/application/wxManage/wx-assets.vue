<template>
  <a-tabs v-model="activeTab" @change="handleTabClick">
    <a-tab-pane key="image" :tab="'图片素材（'+assetsCount.imageCount+')'">
      <material-file fileType="image" ref="imagePanel" @change="materialCount"></material-file>
    </a-tab-pane>
    <a-tab-pane key="voice" :tab="'语音素材（'+assetsCount.voiceCount+')'">
      <material-file fileType="voice" ref="voicePanel" @change="materialCount"></material-file>
    </a-tab-pane>
    <a-tab-pane key="video" :tab="'视频素材（'+assetsCount.videoCount+')'">
      <material-file fileType="video" ref="videoPanel" @change="materialCount"></material-file>
    </a-tab-pane>
    <a-tab-pane :tab="'图文素材（'+assetsCount.newsCount+')'" key="news">
      <material-news ref="newsPanel" @change="materialCount"></material-news>
    </a-tab-pane>
  </a-tabs>

</template>
<script>
export default {
  name: 'WxAssets',
  data() {
    return {
      activeTab: 'image',
      assetsCount: {
        imageCount: '..',
        videoCount: '..',
        voiceCount: '..',
        newsCount: '..',
      },
    }
  },
  components: {
    MaterialFile: () => import('./assets/material-file'),
    MaterialNews: () => import('./assets/material-news'),
  },
  mounted() {
    this.materialCount()
  },
  methods: {
    handleTabClick(activeKey) {
      this.$nextTick(() => {
        this.$refs[activeKey + 'Panel'].init()
      })
    },
    materialCount() {
      // this.$http({
      //     url: this.$http.adornUrl('/manage/wxAssets/materialCount')
      // }).then(({ data }) => {
      //     if (data && data.code == 200) {
      //         this.assetsCount=data.data
      //     } else {
      //         this.$message.error(data.msg);
      //     }
      // })
    },
  },
}
</script>

<style lang="less" scoped>
.WxAssets {
  background: #fff;
  padding: 24px;
}
</style>