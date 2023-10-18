import userApi from '../../../api/user'

Page({

  data: {
    page: 0,
    isLoading: false
  },

  toDetail(e) {
    const id = e.currentTarget.dataset.item.to.id
    wx.$router.push("/pages/wall/ugcDetail/index" + { ugc_id: id });
  },

  async onLoad(options) {
    wx.showLoading({
      title: '加载中...',
    })
    let res = await userApi.getCollectedMine(0)
    this.setData({
      collect: res.data.data
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: '刷新中...',
    })
    let res = await userApi.getCollectedMine(1, this.data.page === 0 ? 20 : 20 * this.data.page)
    let collect = res.data.data
    this.setData({
      collect
    })
    wx.hideLoading({
      success: (res) => {},
    })
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  async onReachBottom() {
    this.setData({
      isLoading: true
    })
    let res = await userApi.getCollectedMine(this.data.page + 1)
    let collectNext = res.data.data
    this.setData({
      'collect.list': [...this.data.collect.list, ...collectNext.list],
      page: collectNext.list.length === 0 ? this.data.page : this.data.page + 1
    })
    this.setData({
      isLoading: false
    })
  },

})