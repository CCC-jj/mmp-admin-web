export default {
  namespaced: true,
  state: {
    ARTICLE_TYPES: {
      1: '普通文章',
      5: '帮助中心'
    },
    XmlMsgType: {
      text: '文字',
      image: '图片',
      voice: '语音',
      shortvideo: '短视频',
      video: '视频',
      news: '图文',
      music: '音乐',
      location: '位置',
      link: '链接',
      event: '事件',
      transfer_customer_service: '转客服'
    },
    KefuMsgType: {
      text: '文本消息',
      image: '图片消息',
      voice: '语音消息',
      video: '视频消息',
      music: '音乐消息',
      news: '文章链接',
      mpnews: '公众号图文消息',
      wxcard: '卡券消息',
      miniprogrampage: '小程序消息',
      msgmenu: '菜单消息'
    },
    ACCOUNT_TYPES: {
      1: '订阅号',
      2: '服务号'
    },
    accountList: [],
    selectedAppid: '',
    tags: []
  },
  mutations: {
    updateAccountList(state, list) {
      state.accountList = list
      if (!list.length) return
      if (!state.selectedAppid) {
        let appidCookie = Vue.cookie.get('appid')
        let selectedAppid = appidCookie ? appidCookie : list[0].appid
        this.commit('wxAccount/selectAccount', selectedAppid)
      }
    },
    selectAccount(state, appid) {
      Vue.cookie.set('appid', appid)
      let oldAppid = state.selectedAppid
      state.selectedAppid = appid
      if (oldAppid) {
        //切换账号时刷新网页
        location.reload()
      }
    },
    updateTags(state, tags) {
      state.tags = tags
    }
  }
}
