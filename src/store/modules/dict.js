export default {
  namespaced: true,
  state: {
    detailsTitle: '暂无',
  },
  mutations: {
    changeTitle(state, value) {
      state.detailsTitle = value
    },
  },
  actions: {},
}
